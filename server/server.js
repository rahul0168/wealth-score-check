const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
const requiredEnvVars = ['SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Configure GoDaddy SMTP
// Create a .env file with the following variables:
// SMTP_HOST=smtpout.secureserver.net
// SMTP_PORT=587
// SMTP_SECURE=false
// SMTP_USER=your-email@yourdomain.com
// SMTP_PASS=your-email-password
// SMTP_FROM=your-email@yourdomain.com
// RECIPIENT_EMAIL=anirudh@ashianafinserve.com

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email template function
const generateEmailTemplate = (data) => {
  const {
    name, dob, age, anniversary, email, phone, income,
    goals, marketReaction, fallComfort, readAndUnderstood,
    risk, overAllTotalContri, verdict, contactInfo,
    fd_overall, gold_overall, debt_mf_overall, equity_overall,
    equity_mf_overall, insurance_overall, aif_overall, real_estate_overall
  } = data;

  // Calculate individual contributions for each asset class
  const fd_contribution = ((fd_overall || 0) * 5 / 100).toFixed(2);
  const gold_contribution = ((gold_overall || 0) * 5 / 100).toFixed(2);
  const debt_schemes_contribution = ((debt_mf_overall || 0) * 5 / 100).toFixed(2);
  const equity_contribution = ((equity_overall || 0) * 15 / 100).toFixed(2);
  const mutual_fund_contribution = ((equity_mf_overall || 0) * 15 / 100).toFixed(2);
  const insurance_contribution = ((insurance_overall || 0) * 7 / 100).toFixed(2);
  const aif_contribution = ((aif_overall || 0) * 10 / 100).toFixed(2);
  const real_estate_contribution = ((real_estate_overall || 0) * 8 / 100).toFixed(2);

  // Convert goals, marketReaction values to readable text
  const goalsText = goals === '10' ? 'Short Term' : goals === '20' ? 'Medium Term' : goals === '30' ? 'Long Term' : goals;
  const marketReactionText = marketReaction === '30' ? 'Buy' : marketReaction === '20' ? 'Hold' : marketReaction === '10' ? 'Sell' : marketReaction;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    .form-field {
      margin-bottom: 10px;
    }
    .field-name {
      font-weight: bold;
    }
    .asset-table {
      margin-top: 20px;
      width: 100%;
      border-collapse: collapse;
    }
    .asset-table th, .asset-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .asset-table th {
      background-color: #f2f2f2;
    }
    .verdict {
      margin-top: 20px;
      font-weight: bold;
    }
    .contact-info {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>Form Submission Details</h1>
  
  <div class="form-field">
    <span class="field-name">Name:</span> ${name || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Date of Birth:</span> ${dob || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Age:</span> ${age || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Anniversary:</span> ${anniversary || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Email:</span> ${email || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Mobile:</span> ${phone || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Annual Income:</span> ${income || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Financial Goals:</span> ${goalsText || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Market Reaction:</span> ${marketReactionText || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Comfortable Fall:</span> ${fallComfort || 'Not provided'}%
  </div>
  <div class="form-field">
    <span class="field-name">Risk profile:</span> ${risk || 'Not provided'}
  </div>
  <div class="form-field">
    <span class="field-name">Read and Understood:</span> ${readAndUnderstood || 'Not provided'}
  </div>

  <table class="asset-table">
  <tr>
    <th>Name of Asset Class</th>
    <th>Overall%</th>
    <th>Returns</th>
    <th>Overall Contribution</th>
  </tr>
  <tr>
    <td>FD</td>
    <td>${fd_overall || 0}</td>
    <td>5</td>
    <td>${fd_contribution}</td>
  </tr>
  <tr>
    <td>Gold</td>
    <td>${gold_overall || 0}</td>
    <td>5</td>
    <td>${gold_contribution}</td>
  </tr>
  <tr>
    <td>Debt Schemes</td>
    <td>${debt_mf_overall || 0}</td>
    <td>5</td>
    <td>${debt_schemes_contribution}</td>
  </tr>
  <tr>
    <td>Equity</td>
    <td>${equity_overall || 0}</td>
    <td>15</td>
    <td>${equity_contribution}</td>
  </tr>
  <tr>
    <td>Mutual Fund</td>
    <td>${equity_mf_overall || 0}</td>
    <td>15</td>
    <td>${mutual_fund_contribution}</td>
  </tr>
  <tr>
    <td>Insurance</td>
    <td>${insurance_overall || 0}</td>
    <td>7</td>
    <td>${insurance_contribution}</td>
  </tr>
  <tr>
    <td>AIF</td>
    <td>${aif_overall || 0}</td>
    <td>10</td>
    <td>${aif_contribution}</td>
  </tr>
  <tr>
    <td>Real Estate</td>
    <td>${real_estate_overall || 0}</td>
    <td>8</td>
    <td>${real_estate_contribution}</td>
  </tr>
  <tr>
    <td>Total</td>
    <td>100</td>
    <td></td>
    <td>${overAllTotalContri || 0}</td>
  </tr>
</table>

  <div class="verdict">
    <p>Overall Total Contribution: ${overAllTotalContri || 0}%</p>
    <p>Verdict: ${verdict || 'Not provided'}</p>
  </div>

  <div class="contact-info">
    <p>${contactInfo || 'Not provided'}</p>
  </div>
</body>
</html>
  `;
};

// API endpoint to send email
app.post('/api/send-email', async (req, res) => {
  try {
    const emailData = req.body;
    
    // Generate email template
    const htmlContent = generateEmailTemplate(emailData);
    
    // Email recipients
    const recipients = [
      process.env.RECIPIENT_EMAIL || 'anirudh@ashianafinserve.com',
      emailData.email
    ];
    
    // Send email to each recipient
    const emailPromises = recipients.map(recipient => {
      return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: recipient,
        subject: `Wealth Score Assessment - ${emailData.name}`,
        html: htmlContent,
      });
    });
    
    await Promise.all(emailPromises);
    
    res.json({ 
      success: true, 
      message: 'Emails sent successfully' 
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📧 SMTP configured for: ${process.env.SMTP_USER}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
}); 