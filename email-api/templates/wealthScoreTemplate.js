/**
 * Generates HTML email template for wealth score assessment
 * @param {Object} data - The form data containing all user inputs
 * @returns {string} HTML email template
 */
const generateWealthScoreEmailTemplate = (data) => {
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

  // Convert numeric values to readable text
  const goalsText = goals === '10' ? 'Short Term' : goals === '20' ? 'Medium Term' : goals === '30' ? 'Long Term' : goals;
  const marketReactionText = marketReaction === '30' ? 'Buy' : marketReaction === '20' ? 'Hold' : marketReaction === '10' ? 'Sell' : marketReaction;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wealth Score Assessment Report</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      font-size: 28px;
      margin-bottom: 30px;
      text-align: center;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }
    h2 {
      color: #34495e;
      font-size: 22px;
      margin-top: 30px;
      margin-bottom: 15px;
      border-left: 4px solid #3498db;
      padding-left: 15px;
    }
    .form-section {
      margin-bottom: 30px;
    }
    .form-field {
      margin-bottom: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #ecf0f1;
    }
    .field-name {
      font-weight: bold;
      color: #2c3e50;
      display: inline-block;
      min-width: 150px;
    }
    .field-value {
      color: #34495e;
    }
    .asset-table {
      margin-top: 20px;
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .asset-table th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: bold;
      padding: 15px 12px;
      text-align: left;
      font-size: 14px;
    }
    .asset-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ecf0f1;
    }
    .asset-table tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    .asset-table tr:hover {
      background-color: #e8f4f8;
    }
    .asset-table .total-row {
      background-color: #2c3e50 !important;
      color: white;
      font-weight: bold;
    }
    .verdict {
      margin-top: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      text-align: center;
    }
    .verdict h3 {
      margin: 0 0 10px 0;
      font-size: 20px;
    }
    .verdict p {
      margin: 10px 0;
      font-size: 16px;
    }
    .contact-info {
      margin-top: 30px;
      padding: 15px;
      background-color: #e8f6f3;
      border-left: 4px solid #27ae60;
      border-radius: 5px;
    }
    .contact-info p {
      margin: 0;
      font-weight: bold;
      color: #27ae60;
    }
    .risk-profile {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 12px;
    }
    .risk-moderate { background-color: #f39c12; color: white; }
    .risk-medium { background-color: #e67e22; color: white; }
    .risk-high { background-color: #e74c3c; color: white; }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #7f8c8d;
      font-size: 12px;
      border-top: 1px solid #ecf0f1;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Wealth Score Assessment Report</h1>
    
    <div class="form-section">
      <h2>Personal Information</h2>
      <div class="form-field">
        <span class="field-name">Name:</span>
        <span class="field-value">${name || 'Not provided'}</span>
      </div>
      <div class="form-field">
        <span class="field-name">Date of Birth:</span>
        <span class="field-value">${dob || 'Not provided'}</span>
      </div>
      <div class="form-field">
        <span class="field-name">Age:</span>
        <span class="field-value">${age || 'Not provided'}</span>
      </div>
      <div class="form-field">
        <span class="field-name">Anniversary:</span>
        <span class="field-value">${anniversary || 'Not provided'}</span>
      </div>
      <div class="form-field">
        <span class="field-name">Email:</span>
        <span class="field-value">${email || 'Not provided'}</span>
      </div>
      <div class="form-field">
        <span class="field-name">Mobile:</span>
        <span class="field-value">${phone || 'Not provided'}</span>
      </div>
      <div class="form-field">
        <span class="field-name">Annual Income:</span>
        <span class="field-value">${income || 'Not provided'}</span>
      </div>
    </div>

    <div class="form-section">
      <h2>Risk Assessment</h2>
      <div class="form-field">
        <span class="field-name">Financial Goals:</span>
        <span class="field-value">${goalsText || 'Not provided'}</span>
      </div>
      <div class="form-field">
        <span class="field-name">Market Reaction:</span>
        <span class="field-value">${marketReactionText || 'Not provided'}</span>
      </div>
      <div class="form-field">
        <span class="field-name">Comfortable Fall:</span>
        <span class="field-value">${fallComfort || 'Not provided'}%</span>
      </div>
      <div class="form-field">
        <span class="field-name">Risk Profile:</span>
        <span class="field-value">
          <span class="risk-profile risk-${(risk || '').toLowerCase()}">${risk || 'Not provided'}</span>
        </span>
      </div>
      <div class="form-field">
        <span class="field-name">Read and Understood:</span>
        <span class="field-value">${readAndUnderstood || 'Not provided'}</span>
      </div>
    </div>

    <div class="form-section">
      <h2>Asset Allocation Analysis</h2>
      <table class="asset-table">
        <thead>
          <tr>
            <th>Asset Class</th>
            <th>Overall %</th>
            <th>Expected Returns %</th>
            <th>Contribution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fixed Deposit (FD)</td>
            <td>${fd_overall || 0}%</td>
            <td>5%</td>
            <td>${fd_contribution}%</td>
          </tr>
          <tr>
            <td>Gold</td>
            <td>${gold_overall || 0}%</td>
            <td>5%</td>
            <td>${gold_contribution}%</td>
          </tr>
          <tr>
            <td>Debt Schemes</td>
            <td>${debt_mf_overall || 0}%</td>
            <td>5%</td>
            <td>${debt_schemes_contribution}%</td>
          </tr>
          <tr>
            <td>Equity</td>
            <td>${equity_overall || 0}%</td>
            <td>15%</td>
            <td>${equity_contribution}%</td>
          </tr>
          <tr>
            <td>Mutual Fund</td>
            <td>${equity_mf_overall || 0}%</td>
            <td>15%</td>
            <td>${mutual_fund_contribution}%</td>
          </tr>
          <tr>
            <td>Insurance</td>
            <td>${insurance_overall || 0}%</td>
            <td>7%</td>
            <td>${insurance_contribution}%</td>
          </tr>
          <tr>
            <td>Alternative Investment Fund (AIF)</td>
            <td>${aif_overall || 0}%</td>
            <td>10%</td>
            <td>${aif_contribution}%</td>
          </tr>
          <tr>
            <td>Real Estate</td>
            <td>${real_estate_overall || 0}%</td>
            <td>8%</td>
            <td>${real_estate_contribution}%</td>
          </tr>
          <tr class="total-row">
            <td><strong>Total Portfolio</strong></td>
            <td><strong>100%</strong></td>
            <td><strong>-</strong></td>
            <td><strong>${overAllTotalContri || 0}%</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="verdict">
      <h3>📈 Assessment Results</h3>
      <p><strong>Overall Portfolio Contribution: ${overAllTotalContri || 0}%</strong></p>
      <p><strong>Recommendation:</strong> ${verdict || 'Not provided'}</p>
    </div>

    <div class="contact-info">
      <p>💬 ${contactInfo || 'For more information, please contact our support team.'}</p>
    </div>

    <div class="footer">
      <p>This report was generated automatically based on your wealth score assessment.</p>
      <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  generateWealthScoreEmailTemplate
}; 