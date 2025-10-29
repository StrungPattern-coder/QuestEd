/**
 * Email Configuration Test Script
 * 
 * This script tests your SMTP configuration to ensure emails can be sent.
 * 
 * Usage:
 * 1. Configure SMTP settings in .env file
 * 2. Run: node test-email.js
 * 3. Check the recipient's email inbox
 * 
 * If successful, you'll see: ✅ Email sent successfully!
 * If failed, you'll see error details to help troubleshoot.
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfiguration() {
  console.log('\n🔍 Testing Email Configuration...\n');
  
  // Display configuration (hide password)
  console.log('Configuration:');
  console.log('  SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET');
  console.log('  SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET');
  console.log('  SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET');
  console.log('  SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET (hidden)' : '❌ NOT SET');
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || '❌ NOT SET');
  console.log('');

  // Check if all required variables are set
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Error: Missing required SMTP configuration in .env file');
    console.log('\nPlease add the following to your .env file:');
    console.log('SMTP_HOST=smtp.gmail.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_USER=your-email@gmail.com');
    console.log('SMTP_PASS=your-app-password');
    console.log('EMAIL_FROM=QuestEd <your-email@gmail.com>');
    process.exit(1);
  }

  // Get test recipient email
  const testRecipient = process.argv[2] || process.env.SMTP_USER;
  console.log(`📧 Sending test email to: ${testRecipient}\n`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true, // Enable debug output
  });

  try {
    // Verify connection
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'QuestEd <noreply@quested.com>',
      to: testRecipient,
      subject: '✅ QuestEd Email Test - Configuration Successful',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Test</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Audiowide', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #000000;
      color: #F5F5F5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 40px 20px;
    }
    .card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(255, 162, 102, 0.2);
      border: 1px solid rgba(255, 162, 102, 0.3);
      text-align: center;
    }
    .logo {
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      width: 80px;
      height: 80px;
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: bold;
      color: #000;
      margin-bottom: 20px;
      font-family: 'Audiowide', sans-serif;
    }
    h1 {
      color: #FF991C;
      font-size: 28px;
      margin: 20px 0;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .success-icon {
      font-size: 64px;
      margin: 20px 0;
    }
    .info-box {
      background: rgba(255, 162, 102, 0.1);
      border: 1px solid rgba(255, 162, 102, 0.3);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: left;
    }
    .config-item {
      margin: 8px 0;
      font-size: 14px;
    }
    .config-label {
      color: #FF991C;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">Q</div>
      <div class="success-icon">✅</div>
      <h1>Email Configuration Successful!</h1>
      <p>Your SMTP settings are working correctly. QuestEd can now send emails.</p>
      
      <div class="info-box">
        <div class="config-item">
          <span class="config-label">SMTP Host:</span> ${process.env.SMTP_HOST}
        </div>
        <div class="config-item">
          <span class="config-label">SMTP Port:</span> ${process.env.SMTP_PORT}
        </div>
        <div class="config-item">
          <span class="config-label">SMTP User:</span> ${process.env.SMTP_USER}
        </div>
        <div class="config-item">
          <span class="config-label">From Address:</span> ${process.env.EMAIL_FROM || 'QuestEd <noreply@quested.com>'}
        </div>
        <div class="config-item">
          <span class="config-label">Test Time:</span> ${new Date().toLocaleString()}
        </div>
      </div>
      
      <p style="margin-top: 30px; font-size: 14px; color: #808080;">
        This is a test email from QuestEd. You can now send classroom invitations and test notifications!
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
✅ QuestEd Email Configuration Test

SUCCESS! Your SMTP settings are working correctly.

Configuration:
- SMTP Host: ${process.env.SMTP_HOST}
- SMTP Port: ${process.env.SMTP_PORT}
- SMTP User: ${process.env.SMTP_USER}
- From Address: ${process.env.EMAIL_FROM || 'QuestEd <noreply@quested.com>'}
- Test Time: ${new Date().toLocaleString()}

You can now send classroom invitations and test notifications!

---
This is a test email from QuestEd.
      `,
    });
    
    console.log('\n✅ Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📨 Check the inbox (and spam folder) of:', testRecipient);
    console.log('\n🎉 Your email configuration is working correctly!');
    console.log('📚 See EMAIL_SETUP.md for more information.\n');
    
  } catch (error) {
    console.error('\n❌ Email test failed!\n');
    console.error('Error details:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    
    if (error.message.includes('Invalid login')) {
      console.log('  • For Gmail: Use an App Password, not your regular password');
      console.log('  • Get App Password: https://myaccount.google.com/apppasswords');
      console.log('  • Ensure 2-Step Verification is enabled on your Google account');
    }
    
    if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
      console.log('  • Check your internet connection');
      console.log('  • Verify SMTP_HOST and SMTP_PORT are correct');
      console.log('  • Try port 587 instead of 465, or vice versa');
      console.log('  • Check if your firewall is blocking SMTP connections');
    }
    
    if (error.message.includes('self signed certificate')) {
      console.log('  • Try adding: tls: { rejectUnauthorized: false } to transporter');
    }
    
    console.log('\n📖 Check EMAIL_SETUP.md for detailed configuration instructions.\n');
    process.exit(1);
  }
}

// Run the test
console.log('═══════════════════════════════════════════════════════════');
console.log('         QuestEd Email Configuration Test');
console.log('═══════════════════════════════════════════════════════════');
testEmailConfiguration();
