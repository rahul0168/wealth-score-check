<?php

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Import classes
use WealthScore\EmailService;
use WealthScore\EmailTemplate;
use WealthScore\RateLimiter;

// Initialize rate limiter
$rateLimiter = new RateLimiter(5, 60); // 5 requests per minute

// Get client IP
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple routing
try {
    switch ($path) {
        case '/':
        case '/health':
            handleHealthCheck();
            break;
            
        case '/api/info':
            handleApiInfo($rateLimiter);
            break;
            
        case '/api/send-email':
            if ($method === 'POST') {
                handleSendEmail($rateLimiter, $clientIp);
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        case '/api/template':
            if ($method === 'POST') {
                handleTemplatePreview($rateLimiter, $clientIp);
            } else {
                sendError('Method not allowed', 405);
            }
            break;
            
        default:
            sendError('Endpoint not found', 404, [
                'availableEndpoints' => ['/health', '/api/info', '/api/send-email', '/api/template']
            ]);
            break;
    }
} catch (Exception $e) {
    sendError('Internal server error', 500, [
        'error' => $e->getMessage()
    ]);
}

/**
 * Handle health check endpoint
 */
function handleHealthCheck(): void
{
    sendResponse([
        'status' => 'OK',
        'timestamp' => date('c'),
        'service' => 'Wealth Score Email API (PHP)',
        'version' => '1.0.0'
    ]);
}

/**
 * Handle API info endpoint
 */
function handleApiInfo(RateLimiter $rateLimiter): void
{
    sendResponse([
        'name' => 'Wealth Score Email API (PHP)',
        'version' => '1.0.0',
        'description' => 'PHP Email API service for wealth score assessment',
        'endpoints' => [
            'health' => '/health',
            'info' => '/api/info',
            'sendEmail' => '/api/send-email',
            'template' => '/api/template'
        ],
        'rateLimit' => $rateLimiter->getRateLimitInfo()
    ]);
}

/**
 * Handle send email endpoint
 */
function handleSendEmail(RateLimiter $rateLimiter, string $clientIp): void
{
    // Check rate limit
    if (!$rateLimiter->isAllowed($clientIp)) {
        sendError('Too many requests. Please try again later.', 429, [
            'retryAfter' => $rateLimiter->getRetryAfter($clientIp)
        ]);
        return;
    }

    // Get POST data
    $input = file_get_contents('php://input');
    $emailData = json_decode($input, true);

    if (!$emailData) {
        sendError('Invalid JSON data', 400);
        return;
    }

    // Validate required fields
    if (empty($emailData['name']) || empty($emailData['email'])) {
        sendError('Name and email are required fields', 400);
        return;
    }

    // Validate required environment variables
    $requiredEnvVars = ['SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    foreach ($requiredEnvVars as $var) {
        if (empty($_ENV[$var])) {
            sendError("Missing required environment variable: {$var}", 500);
            return;
        }
    }

    // Prepare email configuration
    $emailConfig = [
        'smtp_host' => $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com',
        'smtp_port' => $_ENV['SMTP_PORT'] ?? 587,
        'smtp_secure' => $_ENV['SMTP_SECURE'] ?? 'false',
        'smtp_user' => $_ENV['SMTP_USER'],
        'smtp_pass' => $_ENV['SMTP_PASS'],
        'smtp_from' => $_ENV['SMTP_FROM'],
        'recipient_email' => $_ENV['RECIPIENT_EMAIL'] ?? null,
    ];

    try {
        // Initialize email service
        $emailService = new EmailService($emailConfig);
        
        // Send email
        $result = $emailService->sendWealthScoreEmail($emailData);
        
        if ($result['success']) {
            sendResponse($result);
        } else {
            sendError($result['message'], 500, $result);
        }
        
    } catch (Exception $e) {
        sendError('Failed to send email', 500, [
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Handle template preview endpoint
 */
function handleTemplatePreview(RateLimiter $rateLimiter, string $clientIp): void
{
    // Check rate limit
    if (!$rateLimiter->isAllowed($clientIp)) {
        sendError('Too many requests. Please try again later.', 429, [
            'retryAfter' => $rateLimiter->getRetryAfter($clientIp)
        ]);
        return;
    }

    // Get POST data
    $input = file_get_contents('php://input');
    $emailData = json_decode($input, true);

    if (!$emailData) {
        sendError('Invalid JSON data', 400);
        return;
    }

    // Validate required fields
    if (empty($emailData['name']) || empty($emailData['email'])) {
        sendError('Name and email are required fields', 400);
        return;
    }

    try {
        // Generate template
        $htmlContent = EmailTemplate::generateWealthScoreTemplate($emailData);
        
        sendResponse([
            'success' => true,
            'message' => 'Email template generated successfully',
            'template' => $htmlContent,
            'data' => $emailData
        ]);
        
    } catch (Exception $e) {
        sendError('Failed to generate email template', 500, [
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Send JSON response
 */
function sendResponse(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit;
}

/**
 * Send error response
 */
function sendError(string $message, int $statusCode = 400, array $additionalData = []): void
{
    $errorData = [
        'success' => false,
        'message' => $message
    ];
    
    if (!empty($additionalData)) {
        $errorData = array_merge($errorData, $additionalData);
    }
    
    sendResponse($errorData, $statusCode);
} 