# Wealth Score Backend Service

This backend service handles email sending for the Wealth Score application using GoDaddy SMTP.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory with the following variables:

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
NODE_ENV=production

# Recipients
RECIPIENT_EMAIL=anirudh@ashianafinserve.com
```

### 3. GoDaddy Email Setup

To use GoDaddy SMTP, you need:

1. **GoDaddy Hosting Account**: You need a hosting account with GoDaddy
2. **Email Address**: Create an email address through your GoDaddy hosting control panel
3. **SMTP Settings**: Use the following settings:
   - **SMTP Server**: `smtpout.secureserver.net`
   - **Port**: `587` (with TLS) or `465` (with SSL)
   - **Security**: TLS/STARTTLS
   - **Authentication**: Required
   - **Username**: Your full email address
   - **Password**: Your email password

### 4. Run the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### POST `/api/send-email`

Sends wealth score assessment email to recipients.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "age": 35,
  "goals": "30",
  "marketReaction": "30",
  "fallComfort": "20",
  "risk": "High",
  "overAllTotalContri": 12.5,
  "fd_overall": 20,
  "gold_overall": 10,
  "debt_mf_overall": 15,
  "equity_overall": 25,
  "equity_mf_overall": 20,
  "insurance_overall": 5,
  "aif_overall": 0,
  "real_estate_overall": 5
}
```

**Response:**

```json
{
  "success": true,
  "message": "Emails sent successfully"
}
```

### GET `/health`

Health check endpoint.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Email Template

The service generates a professional HTML email template that includes:

- Personal information
- Risk assessment results
- Asset allocation table with calculations
- Professional recommendations
- Contact information

## Troubleshooting

### Common Issues

1. **Authentication Failed**:

   - Verify your email credentials
   - Make sure the email account exists in GoDaddy
   - Check if 2-factor authentication is enabled

2. **Connection Timeout**:

   - Verify SMTP server address
   - Check if port 587 is open
   - Try using port 465 with SSL

3. **Email Not Received**:
   - Check spam folder
   - Verify recipient email addresses
   - Check GoDaddy email logs

### Testing

You can test the email functionality using curl:

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "goals": "30",
    "marketReaction": "30",
    "fallComfort": "20",
    "risk": "High",
    "overAllTotalContri": 12.5,
    "fd_overall": 20,
    "gold_overall": 10,
    "debt_mf_overall": 15,
    "equity_overall": 25,
    "equity_mf_overall": 20,
    "insurance_overall": 5,
    "aif_overall": 0,
    "real_estate_overall": 5
  }'
```
