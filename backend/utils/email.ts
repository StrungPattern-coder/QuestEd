import nodemailer from 'nodemailer';

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'QuestEd <noreply@quested.com>';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  classroomInvitation: (data: {
    studentName: string;
    teacherName: string;
    classroomName: string;
    classroomDescription?: string;
    inviteLink: string;
  }) => {
    const { studentName, teacherName, classroomName, classroomDescription, inviteLink } = data;

    return {
      subject: `You've been invited to join ${classroomName} on QuestEd`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Classroom Invitation</title>
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
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(255, 162, 102, 0.2);
      border: 1px solid rgba(255, 162, 102, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
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
      margin: 0 0 10px 0;
      font-weight: 700;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .greeting {
      font-size: 18px;
      color: #F5F5F5;
      margin-bottom: 24px;
    }
    .content {
      background: rgba(255, 255, 255, 0.05);
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      border-left: 4px solid #FF991C;
    }
    .classroom-name {
      font-size: 24px;
      font-weight: 700;
      color: #FF991C;
      margin-bottom: 8px;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 0.5px;
    }
    .classroom-description {
      font-size: 16px;
      color: #D0D0D0;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .teacher-name {
      font-size: 14px;
      color: #B0B0B0;
      margin-bottom: 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000000;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
      transition: all 0.3s ease;
      margin: 20px 0;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .cta-button:hover {
      box-shadow: 0 6px 24px rgba(255, 162, 102, 0.6);
      transform: translateY(-2px);
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .info-box {
      background: rgba(255, 162, 102, 0.1);
      border: 1px solid rgba(255, 162, 102, 0.3);
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #D0D0D0;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 162, 102, 0.2);
      font-size: 12px;
      color: #808080;
    }
    .link-fallback {
      word-break: break-all;
      font-size: 12px;
      color: #FF991C;
      margin-top: 16px;
      padding: 12px;
      background: rgba(255, 162, 102, 0.1);
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Q</div>
        <h1>🎓 Classroom Invitation</h1>
      </div>
      
      <p class="greeting">Hi <strong>${studentName}</strong>,</p>
      
      <div class="content">
        <div class="classroom-name">📚 ${classroomName}</div>
        ${classroomDescription ? `<p class="classroom-description">${classroomDescription}</p>` : ''}
        <p class="teacher-name">Teacher: <strong>${teacherName}</strong></p>
      </div>
      
      <div class="info-box">
        <p>
          <strong>🎉 You've been invited!</strong><br>
          Your teacher has added you to their classroom on QuestEd. 
          Click the button below to access your classroom and start taking tests.
        </p>
      </div>
      
      <div class="button-container">
        <a href="${inviteLink}" class="cta-button">
          Join Classroom Now →
        </a>
      </div>
      
      <div class="info-box">
        <p>
          <strong>What's Next?</strong><br>
          • Access all tests created for your classroom<br>
          • Join live tests using join codes<br>
          • View your results and performance<br>
          • Compete on the leaderboard
        </p>
      </div>
      
      <div class="link-fallback">
        <strong>Button not working?</strong> Copy and paste this link into your browser:<br>
        ${inviteLink}
      </div>
      
      <div class="footer">
        <p>
          This is an automated email from QuestEd.<br>
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
        <p style="margin-top: 12px;">
          © 2025 QuestEd - Interactive Learning Platform
        </p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Hi ${studentName},

You've been invited to join ${classroomName} on QuestEd!

Classroom: ${classroomName}
${classroomDescription ? `Description: ${classroomDescription}` : ''}
Teacher: ${teacherName}

Your teacher has added you to their classroom. Click the link below to access your classroom and start taking tests:

${inviteLink}

What's Next?
• Access all tests created for your classroom
• Join live tests using join codes
• View your results and performance
• Compete on the leaderboard

If you didn't expect this invitation, you can safely ignore this email.

© 2025 QuestEd - Interactive Learning Platform
      `,
    };
  },

  testNotification: (data: {
    studentName: string;
    classroomName: string;
    testTitle: string;
    testDescription?: string;
    testLink: string;
  }) => {
    const { studentName, classroomName, testTitle, testDescription, testLink } = data;

    return {
      subject: `New Test Available: ${testTitle}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Test Available</title>
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
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(255, 162, 102, 0.2);
      border: 1px solid rgba(255, 162, 102, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
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
      margin: 0 0 10px 0;
      font-weight: 700;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    h2 {
      color: #FF991C;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 0.5px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000000;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Q</div>
        <h1>📝 New Test Available</h1>
      </div>
      
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>A new test has been created in <strong>${classroomName}</strong>:</p>
      
      <h2 style="color: #FF991C;">${testTitle}</h2>
      ${testDescription ? `<p>${testDescription}</p>` : ''}
      
      <div class="button-container">
        <a href="${testLink}" class="cta-button">
          Take Test Now →
        </a>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Hi ${studentName},

A new test has been created in ${classroomName}:

Test: ${testTitle}
${testDescription ? `Description: ${testDescription}` : ''}

Click the link below to take the test:
${testLink}

© 2025 QuestEd - Interactive Learning Platform
      `,
    };
  },

  passwordReset: (data: {
    userName: string;
    resetLink: string;
    expiresIn: string;
  }) => {
    const { userName, resetLink, expiresIn } = data;

    return {
      subject: 'Reset Your QuestEd Password',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
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
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(255, 162, 102, 0.2);
      border: 1px solid rgba(255, 162, 102, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
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
      margin: 0 0 10px 0;
      font-weight: 700;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .greeting {
      font-size: 18px;
      color: #F5F5F5;
      margin-bottom: 24px;
    }
    .content {
      background: rgba(255, 255, 255, 0.05);
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      line-height: 1.6;
      color: #D0D0D0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000000;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
      transition: all 0.3s ease;
      margin: 20px 0;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .cta-button:hover {
      box-shadow: 0 6px 24px rgba(255, 162, 102, 0.6);
      transform: translateY(-2px);
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .warning-box {
      background: rgba(255, 69, 58, 0.1);
      border: 1px solid rgba(255, 69, 58, 0.3);
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }
    .warning-box p {
      margin: 0;
      font-size: 14px;
      color: #FFB3B3;
      line-height: 1.6;
    }
    .info-box {
      background: rgba(255, 162, 102, 0.1);
      border: 1px solid rgba(255, 162, 102, 0.3);
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #D0D0D0;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 162, 102, 0.2);
      font-size: 12px;
      color: #808080;
    }
    .link-fallback {
      word-break: break-all;
      font-size: 12px;
      color: #FF991C;
      margin-top: 16px;
      padding: 12px;
      background: rgba(255, 162, 102, 0.1);
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Q</div>
        <h1>🔐 Password Reset Request</h1>
      </div>
      
      <p class="greeting">Hi <strong>${userName}</strong>,</p>
      
            <p style="color: #666; font-size: 14px; margin: 20px 0;">
        We received a request to reset your password. Click the button below to create a new password:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #FF991C; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px; margin: 20px 0;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #FF991C; font-size: 14px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        ${resetLink}
      </p>
      
      <div style="background-color: #fff3e0; border-left: 4px solid #FF991C; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="color: #333; font-size: 14px; margin: 0;">
          ⚠️ <strong>Important:</strong> This link will expire in <strong>${expiresIn}</strong> for security reasons. If you didn't request this reset, please ignore this email and your password will remain unchanged.
        </p>
      </div>
      
      <div class="warning-box">
        <p>
          <strong>⚠️ Didn't request this?</strong><br>
          If you didn't request a password reset, you can safely ignore this email. 
          Your password will remain unchanged and your account is secure.
        </p>
      </div>
      
      <div class="link-fallback">
        <strong>Button not working?</strong> Copy and paste this link into your browser:<br>
        ${resetLink}
      </div>
      
      <div class="footer">
        <p>
          This is an automated email from QuestEd.<br>
          Never share your password or reset link with anyone.
        </p>
        <p style="margin-top: 12px;">
          © 2025 QuestEd - Interactive Learning Platform
        </p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Hi ${userName},

We received a request to reset your password for your QuestEd account.

Click the link below to create a new password:
${resetLink}

⏰ This link will expire in ${expiresIn}.

⚠️ Didn't request this?
If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Never share your password or reset link with anyone.

© 2025 QuestEd - Interactive Learning Platform
      `,
    };
  },

  // Welcome email for new users
  welcome: (data: {
    userName: string;
    userEmail: string;
    role: 'student' | 'teacher';
    dashboardLink: string;
  }) => {
    const { userName, role, dashboardLink } = data;
    const roleTitle = role === 'teacher' ? 'Teacher' : 'Student';
    const features = role === 'teacher' 
      ? [
          '📚 Create and manage classrooms',
          '📝 Design custom tests and quizzes',
          '⚡ Host live quick quizzes',
          '📊 Track student performance',
          '🏆 View leaderboards and analytics'
        ]
      : [
          '🎓 Join classrooms with ease',
          '📝 Take tests and quizzes',
          '⚡ Participate in live quizzes',
          '📊 Track your progress',
          '🏆 Compete on leaderboards'
        ];

    return {
      subject: `Welcome to QuestEd! 🎉`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to QuestEd</title>
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
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(255, 162, 102, 0.2);
      border: 1px solid rgba(255, 162, 102, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-center;
      font-size: 48px;
      font-weight: bold;
      margin: 0 auto 20px;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
    }
    h1 {
      color: #FF991C;
      font-size: 28px;
      margin: 0;
      text-shadow: 0 2px 8px rgba(255, 162, 102, 0.3);
    }
    .greeting {
      font-size: 18px;
      color: #F5F5F5;
      margin-bottom: 20px;
    }
    .role-badge {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .feature-list {
      margin: 20px 0;
      padding: 20px;
      background: rgba(255, 162, 102, 0.1);
      border-radius: 12px;
      border-left: 4px solid #FF991C;
    }
    .feature-item {
      margin: 12px 0;
      font-size: 15px;
      color: #F5F5F5;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000 !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      margin: 24px 0;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
      transition: transform 0.2s;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .info-box {
      background: rgba(255, 162, 102, 0.15);
      border: 1px solid rgba(255, 162, 102, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      color: #F5F5F5;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 162, 102, 0.2);
      text-align: center;
      font-size: 13px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Q</div>
        <h1>🎉 Welcome to QuestEd!</h1>
      </div>
      
      <p class="greeting">Hi <strong>${userName}</strong>,</p>
      
      <div style="text-align: center;">
        <span class="role-badge">${roleTitle} Account</span>
      </div>
      
      <div class="info-box">
        <p style="margin: 0; font-size: 16px;">
          <strong>🚀 Your account is ready!</strong><br>
          Thank you for joining QuestEd - the interactive learning platform that makes education engaging and fun!
        </p>
      </div>
      
      <div class="feature-list">
        <p style="margin-top: 0; font-weight: bold; color: #FF991C; margin-bottom: 16px;">
          ✨ What you can do as a ${roleTitle}:
        </p>
        ${features.map(feature => `<div class="feature-item">${feature}</div>`).join('')}
      </div>
      
      <div class="button-container">
        <a href="${dashboardLink}" class="cta-button">
          Go to Dashboard →
        </a>
      </div>
      
      <div class="info-box">
        <p style="margin: 0;">
          <strong>💡 Pro Tips:</strong><br>
          ${role === 'teacher' 
            ? '• Start by creating your first classroom<br>• Invite students using their email addresses<br>• Create your first test or try a quick quiz'
            : '• Wait for your teacher to invite you to a classroom<br>• Check notifications for class invites<br>• Join live quizzes using join codes'
          }
        </p>
      </div>
      
      <div class="footer">
        <p>
          Need help? Check out our <a href="${dashboardLink}/how-to-use" style="color: #FF991C; text-decoration: none;">How to Use Guide</a>
        </p>
        <p style="margin-top: 12px;">
          © 2025 QuestEd - Interactive Learning Platform
        </p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Hi ${userName},

🎉 Welcome to QuestEd!

Your ${roleTitle} account is ready!
Thank you for joining QuestEd - the interactive learning platform that makes education engaging and fun!

✨ What you can do as a ${roleTitle}:
${features.join('\n')}

Get Started: ${dashboardLink}

💡 Pro Tips:
${role === 'teacher' 
  ? '• Start by creating your first classroom\n• Invite students using their email addresses\n• Create your first test or try a quick quiz'
  : '• Wait for your teacher to invite you to a classroom\n• Check notifications for class invites\n• Join live quizzes using join codes'
}

Need help? Check out our How to Use Guide: ${dashboardLink}/how-to-use

© 2025 QuestEd - Interactive Learning Platform
      `,
    };
  },
};

// Helper function to send classroom invitation
export const sendClassroomInvitation = async (data: {
  studentEmail: string;
  studentName: string;
  teacherName: string;
  classroomName: string;
  classroomDescription?: string;
  inviteLink: string;
}) => {
  const template = emailTemplates.classroomInvitation(data);
  
  return await sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

// Helper function to send test notification
export const sendTestNotification = async (data: {
  studentEmail: string;
  studentName: string;
  classroomName: string;
  testTitle: string;
  testDescription?: string;
  testLink: string;
}) => {
  const template = emailTemplates.testNotification(data);
  
  return await sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

// Helper function to send password reset email
export const sendPasswordResetEmail = async (data: {
  userEmail: string;
  userName: string;
  resetLink: string;
  expiresIn?: string;
}) => {
  const template = emailTemplates.passwordReset({
    userName: data.userName,
    resetLink: data.resetLink,
    expiresIn: data.expiresIn || '1 hour',
  });
  
  return await sendEmail({
    to: data.userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

// Helper function to send welcome email to new users
export const sendWelcomeEmail = async (data: {
  userName: string;
  userEmail: string;
  role: 'student' | 'teacher';
  dashboardLink: string;
}) => {
  const template = emailTemplates.welcome(data);
  
  return await sendEmail({
    to: data.userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};
