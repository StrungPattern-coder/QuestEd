# Email System Setup Guide

## Overview
QuestEd now includes a complete email system for sending classroom invitations and test notifications using **Nodemailer** with direct SMTP configuration. No third-party services required!

## Features
✅ Direct SMTP email sending (no third-party APIs)  
✅ Beautiful HTML email templates with QuestEd branding  
✅ Plain text fallback for all emails  
✅ Classroom invitation emails with join links  
✅ Test notification emails (extensible)  
✅ Fallback handling if email fails (student still added to classroom)

---

## Quick Setup

### 1. Configure SMTP Settings

Add these environment variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=QuestEd <noreply@quested.com>

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=https://quest-ed-phi.vercel.app
```

### 2. Email Provider Options

#### Option A: Gmail (Recommended for Development)

1. **Enable 2-Step Verification** on your Google Account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "QuestEd"
   - Copy the 16-character password
3. **Update .env**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop  # Your app password
   EMAIL_FROM=QuestEd <your-email@gmail.com>
   ```

**Gmail Limits**: 500 emails/day (free), 2000 emails/day (Google Workspace)

#### Option B: Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
EMAIL_FROM=QuestEd <your-email@outlook.com>
```

#### Option C: Custom Domain (cPanel, Namecheap, etc.)

1. Check your hosting provider's SMTP settings
2. Common settings:
   ```env
   SMTP_HOST=mail.yourdomain.com
   SMTP_PORT=465  # or 587
   SMTP_USER=noreply@yourdomain.com
   SMTP_PASS=your-password
   EMAIL_FROM=QuestEd <noreply@yourdomain.com>
   ```

#### Option D: AWS SES (Free Tier: 62,000 emails/month)

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key
SMTP_PASS=your-aws-secret-key
EMAIL_FROM=QuestEd <verified-email@yourdomain.com>
```

Note: Requires email verification in AWS SES console.

---

## Email Templates

### 1. Classroom Invitation Email

**Sent when**: Teacher invites a student to classroom

**Features**:
- QuestEd branded header with gradient logo
- Classroom name and description
- Teacher name
- One-click join button
- Responsive HTML design
- Plain text fallback

**Preview**:
```
Subject: You've been invited to join Computer Science 101 on QuestEd

Hi John Doe,

You've been invited to join Computer Science 101!

Classroom: Computer Science 101
Description: Learn programming fundamentals
Teacher: Prof. Smith

[Join Classroom Now →]

What's Next?
• Access all tests created for your classroom
• Join live tests using join codes
• View your results and performance
• Compete on the leaderboard
```

### 2. Test Notification Email (Ready for Future Use)

**Sent when**: Teacher creates a new test (can be enabled)

**Features**:
- Test title and description
- Direct link to take test
- QuestEd branded design

---

## Usage in Code

### Sending Classroom Invitations

The email is automatically sent when a teacher invites a student:

```typescript
// This happens automatically in:
// /app/api/teacher/classrooms/[id]/invite/route.ts

import { sendClassroomInvitation } from '@/backend/utils/email';

await sendClassroomInvitation({
  studentEmail: 'student@ms.pict.edu',
  studentName: 'John Doe',
  teacherName: 'Prof. Smith',
  classroomName: 'Computer Science 101',
  classroomDescription: 'Learn programming fundamentals',
  inviteLink: 'https://quest-ed-phi.vercel.app/join-classroom/12345',
});
```

### Sending Custom Emails

```typescript
import { sendEmail } from '@/backend/utils/email';

await sendEmail({
  to: 'student@ms.pict.edu',
  subject: 'Your custom subject',
  html: '<h1>Your HTML content</h1>',
  text: 'Your plain text content',
});
```

---

## Error Handling

The system is designed to be resilient:

1. **If email sending fails**:
   - Student is still added to the classroom ✅
   - API returns success with `emailSent: false`
   - Error is logged to console
   - Teacher sees: "Student added successfully (email sending failed)"

2. **Email configuration missing**:
   - System attempts to send but fails gracefully
   - Classroom functionality continues to work
   - Check logs for configuration errors

---

## Testing Email Setup

### 1. Test Email Configuration

Create a test script: `test-email.js`

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'your-test-email@gmail.com',
      subject: 'QuestEd Email Test',
      html: '<h1>Email is working!</h1><p>Your SMTP configuration is correct.</p>',
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
}

testEmail();
```

Run: `node test-email.js`

### 2. Test via Application

1. Start your server: `npm run dev`
2. Login as a teacher
3. Go to a classroom detail page
4. Invite a student by email
5. Check the student's email inbox (and spam folder)

---

## Troubleshooting

### Issue: "Invalid login"
**Solution**: 
- Gmail: Use App Password, not regular password
- Outlook: Enable "Allow less secure apps" or use App Password
- Check username is complete email address

### Issue: "Connection timeout"
**Solution**:
- Verify SMTP_HOST and SMTP_PORT
- Check firewall settings
- Try port 587 (TLS) instead of 465 (SSL)

### Issue: "Emails going to spam"
**Solution**:
- Use a verified sender email
- Add SPF/DKIM records to your domain
- Use professional email content (already done in templates)
- Send from a custom domain, not Gmail

### Issue: "SMTP not working in production (Vercel)"
**Solution**:
- Vercel allows SMTP on Pro plans
- Alternative: Use Vercel's environment variables with your SMTP credentials
- Consider AWS SES or custom email API for production

### Issue: Email sent but not received
**Solution**:
- Check spam folder
- Verify recipient email is correct
- Check SMTP provider logs
- Check `console.log` output for email status

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | Yes | smtp.gmail.com | SMTP server hostname |
| `SMTP_PORT` | Yes | 587 | SMTP server port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | Yes | - | SMTP username (usually email address) |
| `SMTP_PASS` | Yes | - | SMTP password or app password |
| `EMAIL_FROM` | Yes | QuestEd <noreply@quested.com> | From address shown in emails |
| `NEXT_PUBLIC_APP_URL` | Yes | http://localhost:3000 | Base URL for links in emails |

---

## Security Best Practices

1. **Never commit** `.env` file to git
2. **Use App Passwords** instead of main account passwords
3. **Rotate credentials** regularly
4. **Use environment variables** for all sensitive data
5. **Monitor email sending** for abuse
6. **Rate limit** invitation endpoints (prevent spam)
7. **Validate email addresses** before sending

---

## Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all SMTP_* variables
   - Add EMAIL_FROM and NEXT_PUBLIC_APP_URL

2. Redeploy your application

3. Test email functionality in production

### Considerations

- **Email limits**: Check your SMTP provider's daily limits
- **Scalability**: For 1000+ users, consider AWS SES or dedicated email service
- **Monitoring**: Add email analytics to track delivery rates
- **Compliance**: Ensure GDPR/privacy compliance for email communications

---

## Email Template Customization

To customize email templates, edit `/backend/utils/email.ts`:

### Change Colors
```typescript
// Find these in the template:
background: linear-gradient(135deg, #FF991C 0%, #FF8F4D 100%);
color: #FF991C;
```

### Change Content
```typescript
emailTemplates.classroomInvitation({
  // Modify the HTML/text in the return object
  html: `your custom HTML`,
  text: `your custom text`,
})
```

### Add New Templates
```typescript
export const emailTemplates = {
  // Existing templates...
  
  yourNewTemplate: (data: YourDataType) => ({
    subject: 'Your subject',
    html: 'Your HTML',
    text: 'Your text',
  }),
};
```

---

## API Response Format

### Success (Email Sent)
```json
{
  "message": "Student added successfully and invitation email sent",
  "student": {
    "_id": "673a1b2c3d4e5f6g7h8i9j0k",
    "name": "John Doe",
    "email": "student@ms.pict.edu"
  },
  "emailSent": true,
  "inviteLink": "https://quest-ed-phi.vercel.app/join-classroom/12345"
}
```

### Success (Email Failed)
```json
{
  "message": "Student added successfully (email sending failed)",
  "student": {
    "_id": "673a1b2c3d4e5f6g7h8i9j0k",
    "name": "John Doe",
    "email": "student@ms.pict.edu"
  },
  "emailSent": false,
  "inviteLink": "https://quest-ed-phi.vercel.app/join-classroom/12345"
}
```

---

## Files Modified/Created

### New Files
- `/backend/utils/email.ts` - Complete email system with templates

### Modified Files
- `/app/api/teacher/classrooms/[id]/invite/route.ts` - Added email sending
- `package.json` - Added nodemailer dependencies

---

## Next Steps

1. **Configure SMTP** - Add credentials to `.env`
2. **Test emails** - Send a test invitation
3. **Monitor logs** - Check console for email status
4. **Optional**: Add email notifications for new tests
5. **Optional**: Add email preferences for students

---

## Support & Resources

- **Nodemailer Docs**: https://nodemailer.com/
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
- **AWS SES Setup**: https://docs.aws.amazon.com/ses/
- **SMTP Testing Tool**: https://www.smtper.net/

---

**Email system is fully implemented and ready to use! Just configure your SMTP credentials and start sending invitations.** 📧✨
