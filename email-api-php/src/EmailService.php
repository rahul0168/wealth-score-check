<?php

namespace WealthScore;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService
{
    private $mailer;
    private $config;

    public function __construct(array $config)
    {
        $this->config = $config;
        $this->mailer = new PHPMailer(true);
        $this->configureMailer();
    }

    /**
     * Configure PHPMailer with environment settings
     */
    private function configureMailer(): void
    {
        try {
            // Server settings
            $this->mailer->isSMTP();
            $this->mailer->Host       = $this->config['smtp_host'];
            $this->mailer->SMTPAuth   = true;
            $this->mailer->Username   = $this->config['smtp_user'];
            $this->mailer->Password   = $this->config['smtp_pass'];
            $this->mailer->SMTPSecure = $this->config['smtp_secure'] === 'true' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port       = (int)$this->config['smtp_port'];

            // Set encoding
            $this->mailer->CharSet = 'UTF-8';
            $this->mailer->Encoding = 'base64';

            // Disable debug output
            $this->mailer->SMTPDebug = SMTP::DEBUG_OFF;

        } catch (Exception $e) {
            throw new Exception("Mailer configuration failed: " . $e->getMessage());
        }
    }

    /**
     * Send wealth score assessment email
     * 
     * @param array $emailData
     * @return array
     */
    public function sendWealthScoreEmail(array $emailData): array
    {
        try {
            // Clear any previous recipients
            $this->mailer->clearAllRecipients();
            $this->mailer->clearAttachments();
            $this->mailer->clearReplyTos();

            // Set sender
            $this->mailer->setFrom($this->config['smtp_from'], 'Wealth Score Assessment');

            // Add recipients
            $recipients = $this->getRecipients($emailData);
            $successCount = 0;
            $failedCount = 0;

            foreach ($recipients as $recipient) {
                try {
                    // Create a new mailer instance for each recipient
                    $individualMailer = clone $this->mailer;
                    $individualMailer->clearAllRecipients();
                    $individualMailer->addAddress($recipient);

                    // Set subject
                    $individualMailer->Subject = 'Wealth Score Assessment - ' . ($emailData['name'] ?? 'User');

                    // Generate email content
                    $htmlContent = EmailTemplate::generateWealthScoreTemplate($emailData);
                    $individualMailer->msgHTML($htmlContent);

                    // Set reply-to if user email is provided
                    if (!empty($emailData['email'])) {
                        $individualMailer->addReplyTo($emailData['email'], $emailData['name'] ?? '');
                    }

                    // Send email
                    $individualMailer->send();
                    $successCount++;

                } catch (Exception $e) {
                    $failedCount++;
                    error_log("Failed to send email to {$recipient}: " . $e->getMessage());
                }
            }

            return [
                'success' => $successCount > 0,
                'message' => $successCount > 0 ? 
                    "Email sent successfully to {$successCount} recipient(s)" : 
                    "Failed to send email to all recipients",
                'details' => [
                    'successful' => $successCount,
                    'failed' => $failedCount,
                    'recipients' => count($recipients)
                ]
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to send email',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get list of recipients for the email
     * 
     * @param array $emailData
     * @return array
     */
    private function getRecipients(array $emailData): array
    {
        $recipients = [];

        // Add primary recipient from config
        if (!empty($this->config['recipient_email'])) {
            $recipients[] = $this->config['recipient_email'];
        }

        // Add user's email
        if (!empty($emailData['email'])) {
            $recipients[] = $emailData['email'];
        }

        // Add additional recipients if provided
        if (!empty($emailData['additionalRecipients']) && is_array($emailData['additionalRecipients'])) {
            $recipients = array_merge($recipients, $emailData['additionalRecipients']);
        }

        return array_unique($recipients);
    }

    /**
     * Test email configuration
     * 
     * @return bool
     */
    public function testConfiguration(): bool
    {
        try {
            $this->mailer->smtpConnect();
            $this->mailer->smtpClose();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Get mailer instance for testing
     * 
     * @return PHPMailer
     */
    public function getMailer(): PHPMailer
    {
        return $this->mailer;
    }
} 