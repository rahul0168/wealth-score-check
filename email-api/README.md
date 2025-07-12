# Wealth Score Email API

A free, standalone email API service for sending wealth score assessment reports with beautiful HTML templates.

## Features

- 🎨 Beautiful HTML email templates
- 🔒 Rate limiting and security features
- 📧 Multiple email provider support
- 🚀 Easy deployment and configuration
- 📊 Wealth score assessment email formatting
- 🔄 Template preview functionality

## Quick Start

### 1. Installation

```bash
cd email-api
npm install
```

### 2. Configuration

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your email provider settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

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

```bash
npm start
```

For development:

```bash
npm run dev
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

**Note**: Use App Password, not your regular password. Enable 2FA and generate an app password.

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
    const response = await fetch('http://localhost:3000/api/send-email', {
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
- Includes retry-after header

## Security Features

- **Helmet.js** for security headers
- **CORS** protection
- **Rate limiting**
- **Input validation**
- **Error handling**

## Deployment

### Local Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
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

## Template Customization

The email template is located in `templates/wealthScoreTemplate.js`. You can customize:

- HTML structure
- CSS styles
- Data formatting
- Branding elements

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**

   - Check your credentials
   - Use app passwords for Gmail/Yahoo
   - Verify SMTP settings

2. **CORS Errors**

   - Update `CORS_ORIGIN` in .env
   - Check frontend URL

3. **Rate Limit Exceeded**

   - Wait 1 minute between requests
   - Implement retry logic in frontend

4. **Template Not Rendering**
   - Check required fields (name, email)
   - Verify data format

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
- Create an issue in the repository
- Review API documentation

---

**Made with ❤️ for the wealth assessment community**
