# 🚀 Quick Start Guide

## Installation & Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 14, React, TypeScript
- MongoDB (Mongoose)
- Authentication (bcryptjs, jsonwebtoken)
- UI Libraries (Tailwind, Shadcn, Framer Motion)
- Ably for real-time features

### Step 2: Set Up MongoDB Atlas

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free M0 tier is fine)
4. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Username: `pictadmin`
   - Password: Generate a secure password
5. Network Access:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access From Anywhere" (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

### Step 3: Set Up Ably (Real-time Features)

1. Go to [https://ably.com](https://ably.com)
2. Sign up for free account
3. Create a new app
4. Go to "API Keys" tab
5. Copy:
   - Root API Key (for server) → `ABLY_API_KEY`
   - Create a new publishable key → `NEXT_PUBLIC_ABLY_CLIENT_KEY`

### Step 4: Configure Environment Variables

Create `.env` file in the root directory:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://pictadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/pict-german-platform?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Ably Keys
ABLY_API_KEY=your-ably-root-api-key
NEXT_PUBLIC_ABLY_CLIENT_KEY=your-ably-publishable-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎯 Testing the Application

### Create Teacher Account
1. Click "Sign Up"
2. Use email format: `yourname@pict.edu`
3. Fill in name and password
4. Login and access teacher dashboard

### Create Student Account
1. Click "Sign Up"
2. Use email format: `enrollment123@ms.pict.edu`
3. Fill in enrollment number (e.g., "12345678")
4. Login and access student dashboard

### Teacher Workflow
1. **Create Classroom**:
   - Go to Dashboard → Create Classroom
   - Enter name (e.g., "German A1 - Batch 2024")
   - Add description

2. **Add Students**:
   - Click on classroom → Manage Students
   - Enter student email
   - Click Add

3. **Create Test**:
   - Create Test → Select classroom
   - Choose mode (Live or Deadline)
   - Set timing
   - Upload questions (CSV or manual)

4. **Start Live Test**:
   - Go to test → Click "Start"
   - Share join code with students
   - Monitor in real-time

### Student Workflow
1. **Join Classroom**: (Teacher adds you)
2. **View Tests**: See available tests on dashboard
3. **Join Live Test**: Enter join code
4. **Take Test**: Answer questions within time limit
5. **View Results**: See score and ranking

## 📦 Deployment to Vercel

### Step 1: Prepare for Deployment

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Add Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from your `.env` file:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ABLY_API_KEY`
   - `NEXT_PUBLIC_ABLY_CLIENT_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)
   - `NEXT_PUBLIC_API_URL` (set to `https://your-domain.vercel.app/api`)

3. Click "Deploy"

### Step 4: Update MongoDB Network Access

1. Go back to MongoDB Atlas
2. Network Access → Add IP Address
3. Add Vercel IP ranges or keep 0.0.0.0/0

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test MongoDB connection
# Check if MONGO_URI is correct
# Ensure IP is whitelisted in Atlas
```

### Authentication Not Working
```bash
# Clear browser localStorage
localStorage.clear()
# Re-login
```

### TypeScript Errors
```bash
# Install missing type definitions
npm install --save-dev @types/node @types/react @types/express
```

### Build Errors
```bash
# Clear .next folder and rebuild
rm -rf .next
npm run build
```

## 📚 Sample Data

### Sample Questions CSV
Create `questions.csv`:
```csv
Question,Correct Answer,Option 1,Option 2,Option 3,Option 4
Was ist das?,der Hund,der Hund,die Katze,das Haus,der Baum
Wie geht es dir?,Gut danke,Gut danke,Schlecht,So lala,Ich weiß nicht
Woher kommst du?,Ich komme aus Indien,Ich komme aus Indien,Du kommst,Er kommt,Sie kommt
```

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.ts`:
```typescript
primary: "221.2 83.2% 53.3%", // Change primary color
```

### Add More Features
- Sound effects: Add to `/public/sounds/`
- Confetti: Already configured with `canvas-confetti`
- Badges: Add to student profiles

## 📞 Support

If you encounter issues:
1. Check console for errors (F12)
2. Verify environment variables
3. Check MongoDB Atlas connection
4. Review Ably dashboard for API usage

## 🚀 Production Checklist

- [ ] Environment variables set in Vercel
- [ ] MongoDB Atlas IP whitelist configured
- [ ] JWT_SECRET is strong and secure
- [ ] Ably account has sufficient quota
- [ ] All features tested in production
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)

**You're all set! 🎉**

Access your live platform at: `https://your-project.vercel.app`
