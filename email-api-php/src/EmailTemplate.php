<?php

namespace WealthScore;

class EmailTemplate
{
    /**
     * Generate HTML email template for wealth score assessment
     * 
     * @param array $data The form data containing all user inputs
     * @return string HTML email template
     */
    public static function generateWealthScoreTemplate(array $data): string
    {
        // Extract data with default values
        $name = $data['name'] ?? 'Not provided';
        $dob = $data['dob'] ?? 'Not provided';
        $age = $data['age'] ?? 'Not provided';
        $anniversary = $data['anniversary'] ?? 'Not provided';
        $email = $data['email'] ?? 'Not provided';
        $phone = $data['phone'] ?? 'Not provided';
        $income = $data['income'] ?? 'Not provided';
        $goals = $data['goals'] ?? 'Not provided';
        $marketReaction = $data['marketReaction'] ?? 'Not provided';
        $fallComfort = $data['fallComfort'] ?? 'Not provided';
        $readAndUnderstood = $data['readAndUnderstood'] ?? 'Not provided';
        $risk = $data['risk'] ?? 'Not provided';
        $overAllTotalContri = $data['overAllTotalContri'] ?? 0;
        $verdict = $data['verdict'] ?? 'Not provided';
        $contactInfo = $data['contactInfo'] ?? 'For more information, please contact our support team.';
        
        // Asset allocation data
        $fdOverall = $data['fd_overall'] ?? 0;
        $goldOverall = $data['gold_overall'] ?? 0;
        $debtMfOverall = $data['debt_mf_overall'] ?? 0;
        $equityOverall = $data['equity_overall'] ?? 0;
        $equityMfOverall = $data['equity_mf_overall'] ?? 0;
        $insuranceOverall = $data['insurance_overall'] ?? 0;
        $aifOverall = $data['aif_overall'] ?? 0;
        $realEstateOverall = $data['real_estate_overall'] ?? 0;

        // Calculate individual contributions for each asset class
        $fdContribution = number_format(($fdOverall * 5 / 100), 2);
        $goldContribution = number_format(($goldOverall * 5 / 100), 2);
        $debtSchemesContribution = number_format(($debtMfOverall * 5 / 100), 2);
        $equityContribution = number_format(($equityOverall * 15 / 100), 2);
        $mutualFundContribution = number_format(($equityMfOverall * 15 / 100), 2);
        $insuranceContribution = number_format(($insuranceOverall * 7 / 100), 2);
        $aifContribution = number_format(($aifOverall * 10 / 100), 2);
        $realEstateContribution = number_format(($realEstateOverall * 8 / 100), 2);

        // Convert numeric values to readable text
        $goalsText = self::convertGoalsToText($goals);
        $marketReactionText = self::convertMarketReactionToText($marketReaction);
        
        // Get current date
        $currentDate = date('F j, Y g:i A');
        
        // Generate risk profile CSS class
        $riskClass = 'risk-' . strtolower($risk);
        
        return "
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Form Submission Details</title>
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
    <div class=\"container\">
        <h1>📊 Wealth Score Assessment Report</h1>
        
        <div class=\"form-section\">
            <h2>Personal Information</h2>
            <div class=\"form-field\">
                <span class=\"field-name\">Name:</span>
                <span class=\"field-value\">{$name}</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Date of Birth:</span>
                <span class=\"field-value\">{$dob}</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Age:</span>
                <span class=\"field-value\">{$age}</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Anniversary:</span>
                <span class=\"field-value\">{$anniversary}</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Email:</span>
                <span class=\"field-value\">{$email}</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Mobile:</span>
                <span class=\"field-value\">{$phone}</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Annual Income:</span>
                <span class=\"field-value\">{$income}</span>
            </div>
        </div>

        <div class=\"form-section\">
            <h2>Risk Assessment</h2>
            <div class=\"form-field\">
                <span class=\"field-name\">Financial Goals:</span>
                <span class=\"field-value\">{$goalsText}</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Market Reaction:</span>
                <span class=\"field-value\">{$marketReactionText}</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Comfortable Fall:</span>
                <span class=\"field-value\">{$fallComfort}%</span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Risk Profile:</span>
                <span class=\"field-value\">
                    <span class=\"risk-profile {$riskClass}\">{$risk}</span>
                </span>
            </div>
            <div class=\"form-field\">
                <span class=\"field-name\">Read and Understood:</span>
                <span class=\"field-value\">{$readAndUnderstood}</span>
            </div>
        </div>

        <div class=\"form-section\">
            <h2>Asset Allocation Analysis</h2>
            <table class=\"asset-table\">
                <thead>
                    <tr>
                        <th>Name Of Asset Class</th>
                        <th>Overall %</th>
                        <th>Returns %</th>
                        <th>Overall Contribution</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Fixed Deposit (FD)</td>
                        <td>{$fdOverall}%</td>
                        <td>5%</td>
                        <td>{$fdContribution}%</td>
                    </tr>
                    <tr>
                        <td>Gold</td>
                        <td>{$goldOverall}%</td>
                        <td>5%</td>
                        <td>{$goldContribution}%</td>
                    </tr>
                    <tr>
                        <td>Debt Schemes</td>
                        <td>{$debtMfOverall}%</td>
                        <td>5%</td>
                        <td>{$debtSchemesContribution}%</td>
                    </tr>
                    <tr>
                        <td>Equity</td>
                        <td>{$equityOverall}%</td>
                        <td>15%</td>
                        <td>{$equityContribution}%</td>
                    </tr>
                    <tr>
                        <td>Mutual Fund</td>
                        <td>{$equityMfOverall}%</td>
                        <td>15%</td>
                        <td>{$mutualFundContribution}%</td>
                    </tr>
                    <tr>
                        <td>Insurance</td>
                        <td>{$insuranceOverall}%</td>
                        <td>7%</td>
                        <td>{$insuranceContribution}%</td>
                    </tr>
                    <tr>
                        <td>Alternative Investment Fund (AIF)</td>
                        <td>{$aifOverall}%</td>
                        <td>10%</td>
                        <td>{$aifContribution}%</td>
                    </tr>
                    <tr>
                        <td>Real Estate</td>
                        <td>{$realEstateOverall}%</td>
                        <td>8%</td>
                        <td>{$realEstateContribution}%</td>
                    </tr>
                    <tr class=\"total-row\">
                        <td><strong>Total Portfolio</strong></td>
                        <td><strong>100%</strong></td>
                        <td><strong>-</strong></td>
                        <td><strong>{$overAllTotalContri}%</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class=\"verdict\">
            <h3>📈 Assessment Results</h3>
            <p><strong>Overall Total Contribution: {$overAllTotalContri}%</strong></p>
            <p><strong>Verdict:</strong> {$verdict}</p>
        </div>

        <div class=\"contact-info\">
            <p>💬 {$contactInfo}</p>
        </div>

        <div class=\"footer\">
            <p>This report was generated automatically based on your wealth score assessment.</p>
            <p>Generated on: {$currentDate}</p>
        </div>
    </div>
</body>
</html>
        ";
    }
    
    /**
     * Convert goals numeric value to readable text
     * 
     * @param string $goals
     * @return string
     */
    private static function convertGoalsToText(string $goals): string
    {
        switch ($goals) {
            case '10':
                return 'Short Term';
            case '20':
                return 'Medium Term';
            case '30':
                return 'Long Term';
            default:
                return $goals;
        }
    }
    
    /**
     * Convert market reaction numeric value to readable text
     * 
     * @param string $marketReaction
     * @return string
     */
    private static function convertMarketReactionToText(string $marketReaction): string
    {
        switch ($marketReaction) {
            case '30':
                return 'Buy';
            case '20':
                return 'Hold';
            case '10':
                return 'Sell';
            default:
                return $marketReaction;
        }
    }
} 