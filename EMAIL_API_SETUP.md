# Email API Service Setup Guide

This guide explains how to set up and use the standalone email API service for your wealth score assessment application.

## 🚀 Quick Setup

### Option 1: Use Node.js Email API Service (Recommended)

1. **Configure React App**

   ```bash
   # Copy the environment example
   cp env.example .env

   # Edit .env file
   VITE_USE_EMAIL_API=true
   VITE_EMAIL_API_URL=http://localhost:3000
   ```

2. **Start Email API Service**

   ```bash
   cd email-api
   npm install
   cp env.example .env
   # Configure your email settings in .env
   npm start
   ```

3. **Start React App**
   ```bash
   npm run dev
   ```

### Option 2: Use PHP Email API Service

1. **Configure React App**

   ```bash
   # Copy the environment example
   cp env.example .env

   # Edit .env file
   VITE_USE_PHP_EMAIL_API=true
   VITE_PHP_EMAIL_API_URL=http://localhost:3001
   ```

2. **Start PHP Email API Service**

   ```bash
   cd email-api-php
   composer install
   cp env.example .env
   # Configure your email settings in .env
   composer start
   ```

3. **Start React App**
   ```bash
   npm run dev
   ```

### Option 3: Use Existing Server (Default)

1. **Configure React App**

   ```bash
   # Edit .env file
   VITE_USE_EMAIL_API=false
   VITE_API_BASE_URL=http://localhost:3001
   ```

2. **Start Backend Server**

   ```bash
   cd server
   npm start
   ```

3. **Start React App**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Email API Service Configuration

The email API service supports multiple email providers:

#### Gmail Configuration

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
RECIPIENT_EMAIL=recipient@example.com
```

#### Outlook Configuration

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-email-password
SMTP_FROM=your-email@outlook.com
RECIPIENT_EMAIL=recipient@example.com
```

#### GoDaddy Configuration

```env
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
SMTP_FROM=your-email@yourdomain.com
RECIPIENT_EMAIL=recipient@example.com
```

### React App Configuration

```env
# Use the Node.js email API service
VITE_USE_EMAIL_API=true
VITE_EMAIL_API_URL=http://localhost:3000

# Use the PHP email API service
VITE_USE_PHP_EMAIL_API=true
VITE_PHP_EMAIL_API_URL=http://localhost:3001

# Or use the existing server (set both above to false)
VITE_USE_EMAIL_API=false
VITE_USE_PHP_EMAIL_API=false
VITE_API_BASE_URL=http://localhost:3001
```

## 📧 Features

### Node.js Email API Service Features

- ✅ Beautiful HTML email templates
- ✅ Rate limiting (5 requests/minute)
- ✅ Security headers and CORS protection
- ✅ Multiple email provider support
- ✅ Template preview functionality
- ✅ Error handling and validation

### PHP Email API Service Features

- ✅ Beautiful HTML email templates
- ✅ Rate limiting (5 requests/minute)
- ✅ CORS protection
- ✅ Multiple email provider support
- ✅ Template preview functionality
- ✅ Error handling and validation
- ✅ Pure PHP implementation
- ✅ Easy deployment on any PHP hosting

### API Endpoints

- `GET /health` - Health check
- `GET /api/info` - API information
- `POST /api/send-email` - Send email
- `POST /api/template` - Preview template

## 🔍 Testing

### Test Node.js Email API Service

```bash
# Health check
curl http://localhost:3000/health

# Send test email
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "risk": "Moderate",
    "overAllTotalContri": 12.5
  }'

# Test template preview
curl -X POST http://localhost:3000/api/template \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "risk": "High",
    "overAllTotalContri": 15.0
  }'
```

### Test PHP Email API Service

```bash
# Health check
curl http://localhost:3001/health

# Send test email
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "risk": "Moderate",
    "overAllTotalContri": 12.5
  }'

# Test template preview
curl -X POST http://localhost:3001/api/template \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "risk": "High",
    "overAllTotalContri": 15.0
  }'
```

## 🚢 Deployment

### Local Development

**With Node.js Email API:**

```bash
# Terminal 1: Start Node.js Email API
cd email-api
npm run dev

# Terminal 2: Start React App
npm run dev
```

**With PHP Email API:**

```bash
# Terminal 1: Start PHP Email API
cd email-api-php
composer dev

# Terminal 2: Start React App
npm run dev
```

**Or use npm scripts:**

```bash
# Start with Node.js Email API
npm run dev:with-email-api

# Start with PHP Email API
npm run dev:with-php-email-api
```

### Production Deployment

1. **Deploy Email API Service**

   - Use any hosting service (Heroku, Railway, DigitalOcean, etc.)
   - Set environment variables
   - Update `VITE_EMAIL_API_URL` in React app

2. **Deploy React App**
   - Build the app: `npm run build`
   - Deploy to any static hosting service

## 🛠️ Troubleshooting

### Common Issues

1. **Email not sending**

   - Check SMTP credentials
   - Verify email provider settings
   - Check firewall/network restrictions

2. **CORS errors**

   - Update `CORS_ORIGIN` in email API `.env`
   - Verify frontend URL

3. **Rate limit exceeded**

   - Wait 1 minute between requests
   - Check rate limiting settings

4. **Template not rendering**
   - Verify required fields (name, email)
   - Check data format

### Debug Steps

1. **Check Email API Service Status**

   ```bash
   curl http://localhost:3000/health
   ```

2. **Check Email API Information**

   ```bash
   curl http://localhost:3000/api/info
   ```

3. **Test Template Generation**
   ```bash
   curl -X POST http://localhost:3000/api/template \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com"}'
   ```

## 📚 Additional Resources

- [Node.js Email API Documentation](./email-api/README.md)
- [PHP Email API Documentation](./email-api-php/README.md)
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [Main Project README](./README.md)

## 💬 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the email API documentation
3. Create an issue in the repository

---

**Happy coding! 🎉**
