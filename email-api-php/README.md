# Wealth Score Email API (PHP)

A PHP-based email API service for sending wealth score assessment reports with beautiful HTML templates.

## Features

- 🎨 Beautiful HTML email templates
- 🔒 Rate limiting and security features
- 📧 Multiple email provider support (Gmail, Outlook, Yahoo, GoDaddy)
- 🚀 Easy deployment and configuration
- 📊 Wealth score assessment email formatting
- 🔄 Template preview functionality
- 🐘 Pure PHP implementation with PHPMailer

## Requirements

- PHP 7.4 or higher
- Composer
- Web server (Apache/Nginx) or PHP built-in server

## Quick Start

### 1. Installation

```bash
cd email-api-php
composer install
```

### 2. Configuration

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your email provider settings:

```env
# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Configuration
SMTP_FROM=your-email@gmail.com
RECIPIENT_EMAIL=recipient@example.com
```

### 3. Start the Server

Using PHP built-in server:

```bash
composer start
# or
php -S localhost:3001 public/index.php
```

For development:

```bash
composer dev
```

## API Endpoints

### Health Check

```http
GET /health
```

### API Information

```http
GET /api/info
```

### Send Email

```http
POST /api/send-email
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "dob": "1990-01-01",
  "age": 34,
  "phone": "1234567890",
  "income": "50000",
  "goals": "30",
  "marketReaction": "30",
  "fallComfort": "20",
  "risk": "High",
  "overAllTotalContri": 15.5,
  "verdict": "Portfolio needs rebalancing",
  "fd_overall": 20,
  "gold_overall": 10,
  "debt_mf_overall": 15,
  "equity_overall": 30,
  "equity_mf_overall": 15,
  "insurance_overall": 5,
  "aif_overall": 3,
  "real_estate_overall": 2
}
```

### Template Preview

```http
POST /api/template
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  // ... other fields
}
```

## Email Provider Configuration

### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Important**: Use App Password, not your regular password. Enable 2FA and generate an app password.

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-email-password
```

### Yahoo

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### GoDaddy

```env
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
```

## Usage from React App

```javascript
const sendEmail = async (formData) => {
  try {
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Email sent successfully');
    } else {
      console.error('Failed to send email:', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Rate Limiting

The API includes rate limiting to prevent abuse:

- **5 requests per minute** per IP address
- Returns HTTP 429 when limit exceeded
- Includes retry-after information

## Security Features

- **CORS** protection
- **Rate limiting**
- **Input validation**
- **Error handling**
- **Environment variable protection**

## Deployment

### Local Development

```bash
composer dev
```

### Production with Apache/Nginx

1. Point document root to `public/` directory
2. Configure environment variables
3. Set up SSL/HTTPS
4. Configure proper permissions

### Docker (Optional)

```dockerfile
FROM php:8.1-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application
COPY . /var/www/html/

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Configure Apache
RUN a2enmod rewrite
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Email sent successfully to 2 recipient(s)",
  "details": {
    "successful": 2,
    "failed": 0,
    "recipients": 2
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "Error details"
}
```

## File Structure

```
email-api-php/
├── src/
│   ├── EmailService.php      # Email sending logic
│   ├── EmailTemplate.php     # HTML template generator
│   └── RateLimiter.php       # Rate limiting logic
├── public/
│   └── index.php             # Main API endpoint
├── vendor/                   # Composer dependencies
├── .env                      # Environment configuration
├── env.example               # Environment template
├── composer.json             # PHP dependencies
└── README.md                 # This file
```

## Testing

### Test API Health

```bash
curl http://localhost:3001/health
```

### Test Email Sending

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "risk": "Moderate",
    "overAllTotalContri": 12.5
  }'
```

### Test Template Preview

```bash
curl -X POST http://localhost:3001/api/template \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "risk": "High",
    "overAllTotalContri": 15.0
  }'
```

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**

   - Check your credentials
   - Use app passwords for Gmail/Yahoo
   - Verify SMTP settings

2. **PHP Extensions Missing**

   - Install required extensions: `php-curl`, `php-openssl`, `php-mbstring`

3. **Permission Denied**

   - Check file permissions
   - Ensure web server can read/write files

4. **Rate Limit Exceeded**
   - Wait 1 minute between requests
   - Implement retry logic in frontend

## Dependencies

- **PHPMailer**: Email sending library
- **vlucas/phpdotenv**: Environment variable management
- **PHP 7.4+**: Required PHP version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use in your projects!

## Support

For issues and questions:

- Check the troubleshooting section
- Review API documentation
- Create an issue in the repository

---

**Made with ❤️ for the wealth assessment community**
