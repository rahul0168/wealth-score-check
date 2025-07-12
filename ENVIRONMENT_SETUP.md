# Environment Setup Guide

This document explains how to set up environment variables for both the frontend and backend of the Wealth Score application.

## Backend Environment Setup

Create a `.env` file in the `server/` directory with the following variables:

```env
# GoDaddy SMTP Configuration
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
SMTP_FROM=your-email@yourdomain.com

# Server Configuration
PORT=3001
NODE_ENV=development

# Recipients
RECIPIENT_EMAIL=anirudh@ashianafinserve.com

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Backend Environment Variables Explained:

- **SMTP_HOST**: GoDaddy SMTP server address
- **SMTP_PORT**: Port for SMTP connection (587 for TLS, 465 for SSL)
- **SMTP_SECURE**: Set to `true` for SSL, `false` for TLS
- **SMTP_USER**: Your full GoDaddy email address
- **SMTP_PASS**: Your email account password
- **SMTP_FROM**: The sender email address
- **PORT**: Port number for the backend server
- **NODE_ENV**: Environment mode (development/production)
- **RECIPIENT_EMAIL**: Default recipient email (admin/business)
- **CORS_ORIGIN**: Frontend URL for CORS configuration

## Frontend Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Frontend Environment Configuration
# Note: Variables must be prefixed with VITE_ to be accessible in the frontend

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Wealth Score Check
VITE_APP_VERSION=1.0.0

# Environment
VITE_NODE_ENV=development
```

### Frontend Environment Variables Explained:

- **VITE_API_BASE_URL**: Backend API server URL
- **VITE_API_TIMEOUT**: Request timeout in milliseconds
- **VITE_APP_NAME**: Application name for branding
- **VITE_APP_VERSION**: Application version
- **VITE_NODE_ENV**: Environment mode

## Production Environment Setup

For production deployment, update the following variables:

### Backend Production (.env):

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Production (.env):

```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_NODE_ENV=production
```

## GoDaddy SMTP Configuration Steps

1. **Login to GoDaddy Hosting Control Panel**
2. **Navigate to Email section**
3. **Create or manage your email account**
4. **Note down your email credentials**
5. **Use the following SMTP settings:**
   - Server: `smtpout.secureserver.net`
   - Port: `587` (TLS) or `465` (SSL)
   - Security: TLS/STARTTLS or SSL
   - Authentication: Yes
   - Username: Your full email address
   - Password: Your email password

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords for email accounts
- Consider using environment-specific configuration files
- For production, use secure environment variable management
- Regularly rotate email passwords and API keys

## Troubleshooting

### Common Issues:

1. **SMTP Authentication Failed**

   - Verify email credentials
   - Check if 2FA is enabled on your GoDaddy account
   - Ensure the email account exists

2. **CORS Errors**

   - Verify CORS_ORIGIN matches your frontend URL
   - Check if ports are correct

3. **API Connection Failed**
   - Verify VITE_API_BASE_URL is correct
   - Ensure backend server is running
   - Check firewall settings

## Quick Start

1. Copy the environment templates above
2. Replace placeholder values with your actual credentials
3. Save as `.env` files in respective directories
4. Restart your development servers
5. Test the email functionality

Remember to update production environment variables when deploying to live servers.
