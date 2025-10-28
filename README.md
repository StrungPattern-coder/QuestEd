# 🚀 PICT German Test Platform

A dynamic, full-stack web platform for German language testing at PICT College, inspired by Kahoot and Duolingo.

## ✨ Features

### For Teachers 👨‍🏫
- Create and manage classrooms
- Add/remove students
- Create tests in **Live Mode** (like Kahoot) or **Deadline Mode** (like Google Classroom)
- Upload question banks (CSV, JSON, or manual input)
- Start live quizzes with real-time participation
- View comprehensive analytics:
  - Who submitted / who didn't
  - Scores & rankings
  - Late submissions
  - Class and overall leaderboards

### For Students 👨‍🎓
- View all enrolled classrooms
- See assigned tests (live and scheduled)
- Take tests with:
  - Timer per question
  - Real-time score updates (live mode)
  - One attempt per test (unless reset by teacher)
- View performance summaries and rankings

### Real-time Features ⚡
- Live quiz broadcasting
- Real-time leaderboard updates
- Connected students counter
- Auto-advance questions
- Teacher notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, Shadcn UI
- **Backend**: Next.js API Routes, Express-style controllers
- **Database**: MongoDB (with Mongoose)
- **Real-time**: Ably
- **Authentication**: JWT with HTTP-only cookies
- **Deployment**: Vercel

## 📁 Project Structure

```
PICT-German-Platform/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── teacher/
│   │   └── student/
│   ├── dashboard/
│   │   ├── teacher/
│   │   └── student/
│   ├── login/
│   ├── signup/
│   ├── tests/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.ts
├── components/
│   └── ui/
├── lib/
│   ├── api.ts
│   ├── store.ts
│   └── utils.ts
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Ably account for real-time features

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuestEd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pict-german-platform?retryWrites=true&w=majority

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Ably
   ABLY_API_KEY=your-ably-api-key
   NEXT_PUBLIC_ABLY_CLIENT_KEY=your-ably-client-key

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Models

### User
- `name`, `email`, `role` (teacher/student)
- `enrollmentNumber`, `rollNumber` (for students)
- `password` (hashed)

### Classroom
- `teacherId`, `name`, `description`
- `students[]` (array of User IDs)

### Test
- `classroomId`, `teacherId`, `title`, `description`
- `mode` (live/deadline)
- `questions[]`, `startTime`, `endTime`
- `timeLimitPerQuestion`, `isActive`, `joinCode`

### Question
- `testId`, `questionText`, `options[]`, `correctAnswer`

### Submission
- `testId`, `studentId`, `answers[]`
- `score`, `submittedAt`, `submittedLate`

### Leaderboard
- `classroomId`, `testId`
- `rankings[]`, `overallRankings[]`

## 🔐 Authentication

### Email Format
- **Teachers**: `name@pict.edu`
- **Students**: `enrollment@ms.pict.edu`

### Workflow
1. User signs up with valid PICT email
2. Role automatically determined from email domain
3. Password hashed with bcrypt
4. JWT token generated and stored
5. Token sent with each request via Authorization header

## 📡 API Routes

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Teacher Routes
- `POST /api/teacher/classrooms` - Create classroom
- `GET /api/teacher/classrooms` - Get all classrooms
- `PUT /api/teacher/classrooms/:id` - Update classroom
- `DELETE /api/teacher/classrooms/:id` - Delete classroom
- `POST /api/teacher/classrooms/:id/students` - Add student
- `DELETE /api/teacher/classrooms/:id/students/:studentId` - Remove student
- `POST /api/teacher/tests` - Create test
- `GET /api/teacher/tests` - Get all tests
- `POST /api/teacher/tests/:id/start` - Start live test
- `POST /api/teacher/tests/:id/stop` - Stop live test
- `POST /api/teacher/tests/:id/questions` - Upload questions
- `GET /api/teacher/tests/:id/results` - Get test results
- `GET /api/teacher/leaderboard/:classroomId` - Get leaderboard

### Student Routes
- `GET /api/student/classrooms` - Get enrolled classrooms
- `GET /api/student/tests` - Get available tests
- `GET /api/student/tests/:id` - Get test details
- `POST /api/student/tests/join` - Join live test
- `POST /api/student/tests/:id/submit` - Submit test
- `GET /api/student/tests/:id/result` - Get test result

## 🎨 UI/UX Features

- **Duolingo-style progress bars** for test completion
- **Kahoot-style countdown timers** with dynamic colors
- **Confetti animations** for top scorers
- **Vibrant gradient backgrounds**
- **Smooth page transitions** with Framer Motion
- **Responsive design** for all screen sizes

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure environment variables
   - Deploy!

3. **Set Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file
   - Redeploy

### MongoDB Atlas Setup

1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist all IP addresses (0.0.0.0/0) for Vercel
4. Get connection string and add to `MONGO_URI`

### Ably Setup

1. Sign up at [ably.com](https://ably.com)
2. Create new app
3. Copy API key to `ABLY_API_KEY`
4. Copy publishable key to `NEXT_PUBLIC_ABLY_CLIENT_KEY`

## 📝 Question Upload Format

### CSV Format
```csv
Question Text,Correct Answer,Option 1,Option 2,Option 3,Option 4
Was ist das?,der Hund,der Hund,die Katze,das Haus,der Baum
Wie heißt du?,Ich heiße...,Ich heiße...,Du heißt...,Er heißt...,Sie heißt...
```

### JSON Format
```json
[
  {
    "questionText": "Was ist das?",
    "options": ["der Hund", "die Katze", "das Haus", "der Baum"],
    "correctAnswer": "der Hund"
  },
  {
    "questionText": "Wie heißt du?",
    "options": ["Ich heiße...", "Du heißt...", "Er heißt...", "Sie heißt..."],
    "correctAnswer": "Ich heiße..."
  }
]
```

## 🎯 Usage Examples

### Teacher Flow
1. Login → Create Classroom → Add Students
2. Create Test → Upload Questions → Set Mode (Live/Deadline)
3. Start Live Test → Monitor in Real-time → View Results

### Student Flow
1. Login → View Classrooms → See Assigned Tests
2. Join Live Test (with code) OR Open Deadline Test
3. Answer Questions → Submit → View Results & Rank

## 🤝 Contributing

This project was built for PICT College. For contributions:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - See LICENSE file for details

## � Documentation

Comprehensive documentation is available in the [`/docs`](./docs) folder:

### Quick Links
- **[Getting Started](./docs/GETTING_STARTED.md)** - Quick start guide
- **[Email Setup (5 min)](./docs/EMAIL_QUICKSTART.md)** - Configure email invitations
- **[Classroom Management](./docs/CLASSROOM_INVITATION.md)** - Student invitation system
- **[i18n Guide](./docs/I18N_GUIDE.md)** - Multiple language support
- **[Project Summary](./docs/PROJECT_SUMMARY.md)** - Complete architecture overview

**[View All Documentation →](./docs/README.md)**

## �👥 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [Your Contact Info]

---

**Built with ❤️ for PICT College**

**Tech Stack**: Next.js 14 · TypeScript · MongoDB · Ably · TailwindCSS · Shadcn UI · Framer Motion
