const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { generateWealthScoreEmailTemplate } = require('./templates/wealthScoreTemplate');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'email_api',
  points: 5, // 5 requests
  duration: 60, // per 60 seconds
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    const key = req.ip || req.connection.remoteAddress;
    await rateLimiter.consume(key);
    next();
  } catch (rateLimiterRes) {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000),
    });
  }
};

// Validate required environment variables
const requiredEnvVars = ['SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP configuration error:', error);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

// API Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Wealth Score Email API',
    version: '1.0.0'
  });
});

// Get API information
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Wealth Score Email API',
    version: '1.0.0',
    description: 'Free email API service for wealth score assessment',
    endpoints: {
      health: '/health',
      info: '/api/info',
      sendEmail: '/api/send-email',
      template: '/api/template'
    },
    rateLimit: {
      points: 5,
      duration: 60,
      message: 'Maximum 5 requests per minute'
    }
  });
});

// Get email template preview
app.post('/api/template', rateLimitMiddleware, (req, res) => {
  try {
    const emailData = req.body;
    
    // Validate required fields
    if (!emailData.name || !emailData.email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required fields'
      });
    }
    
    // Generate email template
    const htmlContent = generateWealthScoreEmailTemplate(emailData);
    
    res.json({
      success: true,
      message: 'Email template generated successfully',
      template: htmlContent,
      data: emailData
    });
    
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate email template',
      error: error.message
    });
  }
});

// Send email endpoint
app.post('/api/send-email', rateLimitMiddleware, async (req, res) => {
  try {
    const emailData = req.body;
    
    // Validate required fields
    if (!emailData.name || !emailData.email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required fields'
      });
    }
    
    // Generate email template
    const htmlContent = generateWealthScoreEmailTemplate(emailData);
    
    // Determine recipients
    const recipients = [];
    
    // Add primary recipient from environment
    if (process.env.RECIPIENT_EMAIL) {
      recipients.push(process.env.RECIPIENT_EMAIL);
    }
    
    // Add user's email
    if (emailData.email) {
      recipients.push(emailData.email);
    }
    
    // Add additional recipients if provided
    if (emailData.additionalRecipients && Array.isArray(emailData.additionalRecipients)) {
      recipients.push(...emailData.additionalRecipients);
    }
    
    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No recipients specified'
      });
    }
    
    // Send email to each recipient
    const emailPromises = recipients.map(recipient => {
      return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: recipient,
        subject: `Wealth Score Assessment - ${emailData.name}`,
        html: htmlContent,
        replyTo: emailData.email,
      });
    });
    
    const results = await Promise.allSettled(emailPromises);
    
    // Check if all emails were sent successfully
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    if (successful === 0) {
      throw new Error('All email sends failed');
    }
    
    res.json({
      success: true,
      message: `Email sent successfully to ${successful} recipient(s)`,
      details: {
        successful: successful,
        failed: failed,
        recipients: recipients.length
      }
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: ['/health', '/api/info', '/api/send-email', '/api/template']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Wealth Score Email API is running on port ${PORT}`);
  console.log(`📧 SMTP configured for: ${process.env.SMTP_USER}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'localhost'}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Rate limiting: 5 requests per minute`);
  console.log(`\n📚 API Documentation:`);
  console.log(`   Health Check: GET /health`);
  console.log(`   API Info: GET /api/info`);
  console.log(`   Send Email: POST /api/send-email`);
  console.log(`   Template Preview: POST /api/template`);
}); 