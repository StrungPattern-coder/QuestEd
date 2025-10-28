# 🚀 Email System Quick Start

## ⚡ Get Email Working in 5 Minutes

### Step 1: Get Gmail App Password (2 minutes)

1. Open: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it: **QuestEd**
4. Click **Generate**
5. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

> **Note**: You need 2-Step Verification enabled on your Google account first!

---

### Step 2: Update .env File (1 minute)

Open `/QuestEd/.env` and update these lines:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com          # ← Your Gmail address
SMTP_PASS=abcd efgh ijkl mnop           # ← Paste the app password
EMAIL_FROM=QuestEd <your-email@gmail.com>
```

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=teacher@gmail.com
SMTP_PASS=xyzw abcd efgh ijkl
EMAIL_FROM=QuestEd <teacher@gmail.com>
```

---

### Step 3: Test Email Configuration (2 minutes)

Run the test script:

```bash
node test-email.js
```

**Expected output:**
```
✅ Email sent successfully!
📬 Message ID: <1234567890@gmail.com>
🎉 Your email configuration is working correctly!
```

Check your Gmail inbox for the test email (check spam folder too).

---

### Step 4: Start Using! (Now!)

```bash
npm run dev
```

1. Login as teacher
2. Go to any classroom detail page
3. Enter student email: `student@ms.pict.edu`
4. Click "Send Invitation"
5. ✅ Student receives beautiful invitation email!

---

## 🎯 What You Get

When you invite a student, they receive:

📧 **Professional Email** with:
- QuestEd branded logo
- Classroom name & description
- Teacher name
- One-click "Join Classroom" button
- Responsive design (mobile-friendly)
- Works in all email clients

---

## 🚨 Troubleshooting

### "Invalid login" error
- ✅ Use **App Password**, not your regular Gmail password
- ✅ Make sure 2-Step Verification is enabled

### "Connection timeout" error
- ✅ Check your internet connection
- ✅ Verify SMTP_HOST is `smtp.gmail.com`
- ✅ Verify SMTP_PORT is `587`

### Email not received
- ✅ Check spam folder
- ✅ Verify student email is correct
- ✅ Run `node test-email.js` first to verify SMTP works

### Want more details?
- See **EMAIL_SETUP.md** for complete guide
- See **EMAIL_IMPLEMENTATION_SUMMARY.md** for technical details

---

## 📝 Gmail Limits

- **Free Gmail**: 500 emails/day
- **Google Workspace**: 2,000 emails/day

More than enough for classroom invitations!

---

## 🌟 Alternative Providers

Don't want to use Gmail? No problem!

### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Custom Domain:
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
```

See **EMAIL_SETUP.md** for AWS SES, cPanel, and more!

---

## ✅ Checklist

- [ ] Get Gmail App Password
- [ ] Update .env with SMTP credentials
- [ ] Run `node test-email.js`
- [ ] Check email inbox (and spam)
- [ ] Start inviting students!

---

## 🎉 That's It!

Your QuestEd platform now sends beautiful, professional classroom invitation emails!

**No monthly fees. No third-party services. Full control.** 🚀

---

*Need help? Check EMAIL_SETUP.md for detailed instructions!*
