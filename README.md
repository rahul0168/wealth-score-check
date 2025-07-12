# Wealth Score Assessment Application

A professional wealth assessment tool that helps users evaluate their financial portfolio and receive personalized recommendations via email.

## Features

- **Interactive Asset Allocation Form** - Input percentage allocations across different asset classes
- **Risk Profile Assessment** - Evaluate investment risk tolerance through questionnaire
- **Automated Calculations** - Real-time calculation of portfolio contribution and returns
- **Professional Email Reports** - Send detailed wealth assessment reports via GoDaddy SMTP
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI/UX** - Built with React, TypeScript, and Tailwind CSS

## Technology Stack

**Frontend:**

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- React Suite for date picker

**Backend:**

- Node.js with Express
- Nodemailer for email sending
- GoDaddy SMTP integration
- CORS support

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

⚠️ **Important**: Configure environment variables before running the application.

See **[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)** for detailed setup instructions.

**Quick Setup:**

1. Create `.env` file in the root directory (frontend)
2. Create `.env` file in the `server/` directory (backend)
3. Copy templates from ENVIRONMENT_SETUP.md
4. Replace placeholder values with your GoDaddy SMTP credentials

### 3. Run the Application

**Option A: Use Start Scripts**

```bash
# Windows
start-dev.bat

# Mac/Linux
chmod +x start-dev.sh
./start-dev.sh
```

**Option B: Manual Start**

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

**Access the application:**

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Project Structure

```
wealth-score-check/
├── src/                    # Frontend source code
│   ├── components/         # UI components
│   ├── lib/               # Utility functions
│   ├── App.tsx            # Main application component
│   └── table.tsx          # Asset allocation table
├── server/                # Backend source code
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
├── public/                # Static assets
├── .env                   # Frontend environment variables
├── server/.env            # Backend environment variables
└── ENVIRONMENT_SETUP.md   # Environment setup guide
```

## Asset Classes Supported

- **Fixed Deposits (FD)** - 5% expected returns
- **Gold** - 5% expected returns
- **Debt Schemes** - 5% expected returns
- **Equity** - 15% expected returns
- **Mutual Funds** - 15% expected returns
- **Insurance** - 7% expected returns
- **Alternative Investment Funds (AIF)** - 10% expected returns
- **Real Estate** - 8% expected returns

## Risk Assessment

The application evaluates risk profiles based on:

- **Financial Goals** (Short/Medium/Long term)
- **Market Reaction** (Buy/Hold/Sell)
- **Fall Comfort Level** (10%/20%/30%)

Risk profiles are categorized as:

- **Moderate** (30-50 points)
- **Medium** (50-60 points)
- **High** (60-90 points)

## Email Features

The application sends professional HTML email reports containing:

- Personal information and contact details
- Complete risk assessment results
- Asset allocation table with calculations
- Investment recommendations
- Professional styling and branding

## API Endpoints

### POST `/api/send-email`

Send wealth assessment email to recipients.

### GET `/health`

Health check endpoint for server monitoring.

## Configuration

### GoDaddy SMTP Settings

- **Host**: `smtpout.secureserver.net`
- **Port**: `587` (TLS) or `465` (SSL)
- **Security**: TLS/STARTTLS
- **Authentication**: Required

### Environment Variables

See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for complete configuration details.

## Development

### Frontend Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development

```bash
cd server
npm run dev          # Start with nodemon
npm start            # Start production server
```

## Production Deployment

1. **Build the frontend:**

   ```bash
   npm run build
   ```

2. **Configure production environment variables**

3. **Deploy backend to your hosting service**

4. **Serve frontend static files**

5. **Update CORS settings for production domain**

## Troubleshooting

### Common Issues

1. **SMTP Authentication Error**

   - Verify GoDaddy email credentials
   - Check if 2FA is enabled
   - Ensure email account exists

2. **CORS Errors**

   - Check CORS_ORIGIN matches frontend URL
   - Verify ports are correct

3. **API Connection Failed**
   - Ensure backend server is running
   - Check VITE_API_BASE_URL configuration
   - Verify firewall settings

### Support

For technical support or questions:

- Check the [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) guide
- Review server logs for error messages
- Verify all environment variables are set correctly

## License

This project is proprietary software for Ashiana Financial Services.

## Contact

For business inquiries: +91 9930181344
Email: anirudh@ashianafinserve.com
