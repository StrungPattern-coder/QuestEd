import nodemailer from 'nodemailer';
import EmailLog from '@/backend/models/EmailLog';

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'QuestEd <noreply@quested.com>';

// ========================================
// RATE LIMITING (Prevent Spam/Abuse)
// ========================================
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const emailRateLimiter = new Map<string, RateLimitEntry>();

/**
 * Check if email sending is allowed based on rate limits
 * @param email - Recipient email address
 * @param maxEmails - Maximum emails allowed per window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if allowed, false if rate limit exceeded
 */
export const checkRateLimit = (
  email: string,
  maxEmails: number = 10,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const entry = emailRateLimiter.get(email);

  if (!entry || now > entry.resetAt) {
    // No entry or window expired - create new entry
    emailRateLimiter.set(email, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (entry.count >= maxEmails) {
    // Rate limit exceeded
    console.warn(`Rate limit exceeded for ${email}: ${entry.count}/${maxEmails} emails in window`);
    return false;
  }

  // Increment count
  entry.count++;
  return true;
};

/**
 * Clean up expired rate limit entries (call periodically)
 */
export const cleanupRateLimiter = () => {
  const now = Date.now();
  for (const [email, entry] of emailRateLimiter.entries()) {
    if (now > entry.resetAt) {
      emailRateLimiter.delete(email);
    }
  }
};

// Auto-cleanup every 5 minutes
setInterval(cleanupRateLimiter, 5 * 60 * 1000);

// ========================================
// EMAIL VALIDATION
// ========================================

// List of common disposable email domains
const disposableEmailDomains = [
  'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'maildrop.cc', 'temp-mail.org', 'getnada.com',
  'sharklasers.com', 'trashmail.com', 'yopmail.com', 'fakeinbox.com',
];

/**
 * Validate email format and check for disposable domains
 * @param email - Email address to validate
 * @returns Object with isValid flag and error message if invalid
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Check for common typos in popular domains
  const commonTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'hotmial.com': 'hotmail.com',
  };

  const domain = email.split('@')[1]?.toLowerCase();
  if (commonTypos[domain]) {
    return {
      isValid: false,
      error: `Did you mean ${email.replace(domain, commonTypos[domain])}?`,
    };
  }

  // Check for disposable email domains
  if (disposableEmailDomains.includes(domain)) {
    return {
      isValid: false,
      error: 'Disposable email addresses are not allowed',
    };
  }

  // Check for localhost/test domains in production
  if (process.env.NODE_ENV === 'production') {
    const testDomains = ['localhost', 'test.com', 'example.com'];
    if (testDomains.includes(domain)) {
      return {
        isValid: false,
        error: 'Test email addresses are not allowed in production',
      };
    }
  }

  return { isValid: true };
};

// Create reusable transporter with connection pooling
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  type?: 'welcome' | 'passwordReset' | 'classroomInvitation' | 'testNotification' | 'testReminder' | 'testResult' | 'teacherSummary' | 'accountActivity';
  trackingId?: string; // For linking to specific actions
}

// ========================================
// EMAIL TRACKING
// ========================================

/**
 * Generate a unique tracking ID for email
 */
const generateTrackingId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Add tracking pixel and link tracking to email HTML
 * @param html - Original HTML content
 * @param trackingId - Unique tracking ID for this email
 * @returns HTML with tracking added
 */
const addEmailTracking = (html: string, trackingId: string): string => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quest-ed-phi.vercel.app';
  
  // Add tracking pixel at the end of body (1x1 transparent image)
  const trackingPixel = `<img src="${appUrl}/api/email/track/open/${trackingId}" width="1" height="1" style="display:none;" alt="" />`;
  
  // Add tracking pixel before closing body tag
  let trackedHtml = html.replace('</body>', `${trackingPixel}</body>`);
  
  // If no body tag, add at the end
  if (!trackedHtml.includes(trackingPixel)) {
    trackedHtml += trackingPixel;
  }
  
  // Wrap all links with tracking (redirect through our server)
  trackedHtml = trackedHtml.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (match, url) => {
      // Don't track internal tracking URLs
      if (url.includes('/api/email/track')) {
        return match;
      }
      const encodedUrl = encodeURIComponent(url);
      return `href="${appUrl}/api/email/track/click/${trackingId}?url=${encodedUrl}"`;
    }
  );
  
  return trackedHtml;
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  // Validate email address
  const validation = validateEmail(options.to);
  if (!validation.isValid) {
    console.error(`Email validation failed for ${options.to}: ${validation.error}`);
    
    // Log failed validation
    try {
      await EmailLog.create({
        to: options.to,
        subject: options.subject,
        type: options.type || 'testNotification',
        status: 'failed',
        errorMessage: validation.error,
        sentAt: new Date(),
      });
    } catch (logError) {
      console.error('Failed to log email validation failure:', logError);
    }
    
    return false;
  }

  // Check rate limit
  if (!checkRateLimit(options.to)) {
    console.error(`Rate limit exceeded for ${options.to}`);
    
    // Log rate limit exceeded
    try {
      await EmailLog.create({
        to: options.to,
        subject: options.subject,
        type: options.type || 'testNotification',
        status: 'failed',
        errorMessage: 'Rate limit exceeded',
        sentAt: new Date(),
      });
    } catch (logError) {
      console.error('Failed to log rate limit error:', logError);
    }
    
    return false;
  }

  // Generate tracking ID
  const trackingId = options.trackingId || generateTrackingId();
  
  // Add tracking to HTML
  const trackedHtml = addEmailTracking(options.html, trackingId);

  const mailOptions = {
    from: EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: trackedHtml,
    text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  };

  let attempt = 0;
  const maxRetries = 3;
  let delay = 500; // ms, initial backoff
  while (attempt < maxRetries) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
      // Log successful email send
      try {
        await EmailLog.create({
          to: options.to,
          subject: options.subject,
          type: options.type || 'testNotification',
          status: 'sent',
          messageId: info.messageId,
          trackingId,
          sentAt: new Date(),
        });
      } catch (logError) {
        console.error('Failed to log email success:', logError);
      }
      
      return true;
    } catch (error: any) {
      attempt++;
      // Log only the error message for security
      console.error('Error sending email:', error?.message || 'Unknown error');
      
      if (attempt >= maxRetries) {
        // Log final failure
        try {
          await EmailLog.create({
            to: options.to,
            subject: options.subject,
            type: options.type || 'testNotification',
            status: 'failed',
            errorMessage: error?.message || 'Unknown error',
            sentAt: new Date(),
          });
        } catch (logError) {
          console.error('Failed to log email failure:', logError);
        }
        
        return false;
      }
      
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; // exponential backoff
    }
  }
  return false;
};

// Email templates
export const emailTemplates = {
  // 1. Test Reminder Email
  testReminder: (data: {
    studentName: string;
    testTitle: string;
    classroomName: string;
    dueDate: string;
    testLink: string;
  }) => {
    const { studentName, testTitle, classroomName, dueDate, testLink } = data;
    return {
      subject: `Reminder: "${testTitle}" test due soon in ${classroomName}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Reminder</title>
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
      font-size: 26px;
      margin: 0 0 10px 0;
      font-weight: 700;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .greeting {
      font-size: 18px;
      color: #F5F5F5;
      margin-bottom: 16px;
    }
    .test-title {
      color: #FF991C;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 6px;
      font-family: 'Audiowide', sans-serif;
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
      font-size: 15px;
      color: #D0D0D0;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000000;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
      margin: 20px 0;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
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
        <h1>⏰ Test Reminder</h1>
      </div>
      <p class="greeting">Hi <strong>${studentName}</strong>,</p>
      <div class="info-box">
        <p>
          This is a reminder that the following test is due soon in <strong>${classroomName}</strong>:
        </p>
        <div class="test-title">${testTitle}</div>
        <p>
          <strong>Due Date:</strong> ${dueDate}
        </p>
      </div>
      <div class="button-container">
        <a href="${testLink}" class="cta-button">
          Take Test Now →
        </a>
      </div>
      <div class="link-fallback">
        <strong>Button not working?</strong> Copy and paste this link into your browser:<br>
        ${testLink}
      </div>
      <div class="footer">
        <p>
          This is an automated reminder from QuestEd.<br>
          Good luck!
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

This is a reminder that the following test is due soon in ${classroomName}:

Test: ${testTitle}
Due Date: ${dueDate}

Take the test now: ${testLink}

Good luck!

© 2025 QuestEd - Interactive Learning Platform
      `,
    };
  },

  // 2. Test Result Notification
  testResult: (data: {
    studentName: string;
    testTitle: string;
    classroomName: string;
    score: string;
    maxScore?: string;
    rank?: string;
    resultLink: string;
  }) => {
    const { studentName, testTitle, classroomName, score, maxScore, rank, resultLink } = data;
    return {
      subject: `Your Results for "${testTitle}" in ${classroomName}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Result Notification</title>
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
      font-size: 26px;
      margin: 0 0 10px 0;
      font-weight: 700;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .greeting {
      font-size: 18px;
      color: #F5F5F5;
      margin-bottom: 16px;
    }
    .info-box {
      background: rgba(255, 162, 102, 0.1);
      border: 1px solid rgba(255, 162, 102, 0.3);
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .result-score {
      color: #FF991C;
      font-size: 28px;
      font-weight: bold;
      margin: 8px 0 8px 0;
      font-family: 'Audiowide', sans-serif;
    }
    .test-title {
      font-size: 20px;
      color: #FF991C;
      font-weight: bold;
      margin-bottom: 6px;
      font-family: 'Audiowide', sans-serif;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000000;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
      margin: 20px 0;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
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
        <h1>📊 Test Results Published</h1>
      </div>
      <p class="greeting">Hi <strong>${studentName}</strong>,</p>
      <div class="info-box">
        <div class="test-title">${testTitle}</div>
        <div>Classroom: <strong>${classroomName}</strong></div>
        <div class="result-score">
          Score: ${score}${maxScore ? ` / ${maxScore}` : ''}
        </div>
        ${rank ? `<div style="color:#FF991C;font-weight:bold;">🏅 Rank: ${rank}</div>` : ''}
      </div>
      <div class="button-container">
        <a href="${resultLink}" class="cta-button">
          View Full Results →
        </a>
      </div>
      <div class="link-fallback">
        <strong>Button not working?</strong> Copy and paste this link into your browser:<br>
        ${resultLink}
      </div>
      <div class="footer">
        <p>
          This is an automated notification from QuestEd.<br>
          Keep up the good work!
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

Your results for "${testTitle}" in ${classroomName} are now available.

Score: ${score}${maxScore ? ` / ${maxScore}` : ''}
${rank ? `Rank: ${rank}` : ''}

View your full results: ${resultLink}

Keep up the good work!

© 2025 QuestEd - Interactive Learning Platform
      `,
    };
  },

  // 3. Teacher Report Summary (weekly)
  teacherSummary: (data: {
    teacherName: string;
    weekRange: string;
    classroomStats: Array<{
      classroomName: string;
      numStudents: number;
      avgScore: string;
      testsTaken: number;
      engagement: string;
    }>;
    dashboardLink: string;
  }) => {
    const { teacherName, weekRange, classroomStats, dashboardLink } = data;
    return {
      subject: `Weekly Report Summary for Your Classes (${weekRange})`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teacher Weekly Report</title>
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
      font-size: 26px;
      margin: 0 0 10px 0;
      font-weight: 700;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .greeting {
      font-size: 18px;
      color: #F5F5F5;
      margin-bottom: 16px;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 15px;
    }
    .summary-table th, .summary-table td {
      padding: 10px 8px;
      border-bottom: 1px solid #222;
      text-align: left;
    }
    .summary-table th {
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000;
      font-weight: bold;
      font-family: 'Audiowide', sans-serif;
    }
    .summary-table td {
      color: #F5F5F5;
      background: rgba(255, 162, 102, 0.05);
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000000;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
      margin: 20px 0;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 162, 102, 0.2);
      font-size: 12px;
      color: #808080;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Q</div>
        <h1>📈 Weekly Report Summary</h1>
      </div>
      <p class="greeting">Hi <strong>${teacherName}</strong>,</p>
      <div style="margin-bottom:16px;">
        Here is your classroom performance summary for <strong>${weekRange}</strong>:
      </div>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Classroom</th>
            <th>Students</th>
            <th>Avg. Score</th>
            <th>Tests Taken</th>
            <th>Engagement</th>
          </tr>
        </thead>
        <tbody>
          ${classroomStats.length === 0
            ? `<tr><td colspan="5" style="text-align:center;color:#FF991C;">No data for this week</td></tr>`
            : classroomStats.map(row => `
              <tr>
                <td>${row.classroomName}</td>
                <td>${row.numStudents}</td>
                <td>${row.avgScore}</td>
                <td>${row.testsTaken}</td>
                <td>${row.engagement}</td>
              </tr>
            `).join('')}
        </tbody>
      </table>
      <div class="button-container">
        <a href="${dashboardLink}" class="cta-button">
          View Full Dashboard →
        </a>
      </div>
      <div class="footer">
        <p>
          This is an automated weekly report from QuestEd.<br>
          For more details, visit your dashboard.
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
Hi ${teacherName},

Here is your classroom performance summary for ${weekRange}:

${classroomStats.length === 0
  ? 'No data for this week.'
  : classroomStats.map(row =>
    `Classroom: ${row.classroomName}
Students: ${row.numStudents}
Avg. Score: ${row.avgScore}
Tests Taken: ${row.testsTaken}
Engagement: ${row.engagement}
`).join('\n')}

View your dashboard: ${dashboardLink}

© 2025 QuestEd - Interactive Learning Platform
      `,
    };
  },

  // 4. Account Activity Alert
  accountActivityAlert: (data: {
    userName: string;
    activityTime: string;
    device: string;
    location: string;
    activityIP: string;
    activityType?: string;
    supportLink: string;
  }) => {
    const { userName, activityTime, device, location, activityIP, activityType, supportLink } = data;
    return {
      subject: `Security Alert: New Login Detected on QuestEd`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Activity Alert</title>
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
      font-size: 26px;
      margin: 0 0 10px 0;
      font-weight: 700;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .greeting {
      font-size: 18px;
      color: #F5F5F5;
      margin-bottom: 16px;
    }
    .alert-box {
      background: rgba(255, 162, 102, 0.1);
      border: 1px solid #FF991C;
      border-radius: 8px;
      padding: 18px;
      margin: 24px 0;
      color: #FF991C;
      font-size: 16px;
      font-family: 'Audiowide', sans-serif;
      font-weight: bold;
      text-align: center;
    }
    .activity-details {
      background: rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 18px;
      color: #F5F5F5;
      font-size: 15px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
      color: #000000;
      text-decoration: none;
      padding: 12px 32px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(255, 162, 102, 0.4);
      margin: 12px 0;
      font-family: 'Audiowide', sans-serif;
      letter-spacing: 1px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 162, 102, 0.2);
      font-size: 12px;
      color: #808080;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Q</div>
        <h1>🔒 Account Activity Alert</h1>
      </div>
      <p class="greeting">Hi <strong>${userName}</strong>,</p>
      <div class="alert-box">
        New login detected on your QuestEd account!
      </div>
      <div class="activity-details">
        <div><strong>Time:</strong> ${activityTime}</div>
        <div><strong>Device:</strong> ${device}</div>
        <div><strong>Location:</strong> ${location}</div>
        <div><strong>IP Address:</strong> ${activityIP}</div>
        ${activityType ? `<div><strong>Activity:</strong> ${activityType}</div>` : ''}
      </div>
      <div style="color:#FF991C;font-size:14px;margin-bottom:16px;">
        If this was you, no action is needed.<br>
        If you didn't recognize this activity, please secure your account immediately.
      </div>
      <div style="text-align:center;">
        <a href="${supportLink}" class="cta-button">
          Secure My Account
        </a>
      </div>
      <div class="footer">
        <p>
          This is a security alert from QuestEd.<br>
          Never share your password or verification codes with anyone.
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

New login detected on your QuestEd account!

Time: ${activityTime}
Device: ${device}
Location: ${location}
IP Address: ${activityIP}
${activityType ? `Activity: ${activityType}` : ''}

If this was you, no action is needed.
If you didn't recognize this activity, please secure your account immediately:
${supportLink}

Never share your password or verification codes with anyone.

© 2025 QuestEd - Interactive Learning Platform
      `,
    };
  },
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
    type: 'classroomInvitation',
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
    type: 'testNotification',
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
    type: 'passwordReset',
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
    type: 'welcome',
  });
};


// Helper function to send test reminder email
export const sendTestReminderEmail = async (data: {
  studentEmail: string;
  studentName: string;
  testTitle: string;
  classroomName: string;
  dueDate: string;
  testLink: string;
}) => {
  const template = emailTemplates.testReminder({
    studentName: data.studentName,
    testTitle: data.testTitle,
    classroomName: data.classroomName,
    dueDate: data.dueDate,
    testLink: data.testLink,
  });
  return await sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    type: 'testReminder',
  });
};

// Helper function to send test result email
export const sendTestResultEmail = async (data: {
  studentEmail: string;
  studentName: string;
  testTitle: string;
  classroomName: string;
  score: string;
  maxScore?: string;
  rank?: string;
  resultLink: string;
}) => {
  const template = emailTemplates.testResult({
    studentName: data.studentName,
    testTitle: data.testTitle,
    classroomName: data.classroomName,
    score: data.score,
    maxScore: data.maxScore,
    rank: data.rank,
    resultLink: data.resultLink,
  });
  return await sendEmail({
    to: data.studentEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    type: 'testResult',
  });
};

// Helper function to send teacher summary email
export const sendTeacherSummaryEmail = async (data: {
  teacherEmail: string;
  teacherName: string;
  weekRange: string;
  classroomStats: Array<{
    classroomName: string;
    numStudents: number;
    avgScore: string;
    testsTaken: number;
    engagement: string;
  }>;
  dashboardLink: string;
}) => {
  const template = emailTemplates.teacherSummary({
    teacherName: data.teacherName,
    weekRange: data.weekRange,
    classroomStats: data.classroomStats,
    dashboardLink: data.dashboardLink,
  });
  return await sendEmail({
    to: data.teacherEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    type: 'teacherSummary',
  });
};

// Helper function to send account activity alert email
export const sendAccountActivityAlertEmail = async (data: {
  userEmail: string;
  userName: string;
  activityTime: string;
  device: string;
  location: string;
  activityIP: string;
  activityType?: string;
  supportLink: string;
}) => {
  const template = emailTemplates.accountActivityAlert({
    userName: data.userName,
    activityTime: data.activityTime,
    device: data.device,
    location: data.location,
    activityIP: data.activityIP,
    activityType: data.activityType,
    supportLink: data.supportLink,
  });
  return await sendEmail({
    to: data.userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    type: 'accountActivity',
  });
};