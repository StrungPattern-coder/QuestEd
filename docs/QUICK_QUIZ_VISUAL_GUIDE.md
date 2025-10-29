# Quick Quiz - Visual User Flow

**Quick Reference Guide for the Instant Quiz Feature**

---

## 🎯 Quick Overview

**Quick Quiz** lets anyone create and join interactive quizzes instantly - no signup required!

```
Create Quiz → Get Join Code → Share → Friends Join → Play Together
     ↓            ↓             ↓          ↓              ↓
   2 min       A1B2C3      Text/Share   30 sec        Real-time
```

---

## 📱 User Journey Map

### Journey 1: Quiz Creator (Host)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE                                 │
│  questEd.com                                                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐          │
│  │  🎉 Create Interactive Quizzes Like Kahoot           │          │
│  │     Free & Open Source                                │          │
│  │                                                        │          │
│  │  ┌────────────────────────────┐                      │          │
│  │  │  ⚡ Create Quick Quiz       │  ← PRIMARY CTA      │          │
│  │  └────────────────────────────┘                      │          │
│  └──────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
                            ↓ CLICK
┌─────────────────────────────────────────────────────────────────────┐
│                    QUICK QUIZ CREATOR                                │
│  /quick-quiz                                                         │
│                                                                      │
│  Step 1 of 2: Quiz Details                                          │
│  ┌──────────────────────────────────────┐                          │
│  │ Quiz Title: [Movie Trivia Night    ] │                          │
│  │ Your Name:  [John Doe             ] │                          │
│  │ Time/Q:     [30 seconds ▼]          │                          │
│  └──────────────────────────────────────┘                          │
│                                                                      │
│  ┌─────────────┐                                                    │
│  │    Next     │                                                    │
│  └─────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────┘
                            ↓ NEXT
┌─────────────────────────────────────────────────────────────────────┐
│  Step 2 of 2: Add Questions                                         │
│                                                                      │
│  Question 1                                                          │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ Question: [What year was The Matrix released?         ] │      │
│  │                                                            │      │
│  │ ○ Option A: [1997]    ○ Option C: [1999] ✓             │      │
│  │ ○ Option B: [1998]    ○ Option D: [2000]               │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                      │
│  ┌────────────────┐  ┌─────────────┐                               │
│  │ + Add Question │  │ Create Quiz │                               │
│  └────────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
                            ↓ CREATE
┌─────────────────────────────────────────────────────────────────────┐
│                        HOST PAGE                                     │
│  /quick-quiz/ABC123/host?code=ABC123                                │
│                                                                      │
│  Movie Trivia Night                                                  │
│  Hosted by John Doe                                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────┐            │
│  │               Join Code                             │            │
│  │                                                      │            │
│  │            A1B2C3            📋 Copy               │            │
│  │                                                      │            │
│  │  Share at: questEd.com/quick-quiz/join             │            │
│  └────────────────────────────────────────────────────┘            │
│                                                                      │
│  👥 Waiting Room (3 participants)                                   │
│  ┌────┐ ┌────┐ ┌────┐                                              │
│  │ JS │ │ EM │ │ RW │                                              │
│  │Jane│ │Emma│ │Ryan│                                              │
│  └────┘ └────┘ └────┘                                              │
│                                                                      │
│  ┌─────────────────────┐  ┌──────────────┐                        │
│  │  ▶ Start Quiz       │  │ 🏆 Results   │                        │
│  └─────────────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Journey 2: Quiz Participant (Joiner)

```
┌─────────────────────────────────────────────────────────────────────┐
│               RECEIVE JOIN CODE                                      │
│                                                                      │
│  📱 Text message: "Join my quiz! Code: A1B2C3"                      │
│  💬 Discord: "Let's play! questEd.com/quick-quiz/join A1B2C3"      │
│  📧 Email: "Quick quiz time! Use code A1B2C3"                       │
└─────────────────────────────────────────────────────────────────────┘
                            ↓ NAVIGATE
┌─────────────────────────────────────────────────────────────────────┐
│                        JOIN PAGE                                     │
│  /quick-quiz/join                                                    │
│                                                                      │
│  ┌────────────────────────────────────┐                            │
│  │        👥 Join Quick Quiz           │                            │
│  │                                     │                            │
│  │  Join Code                          │                            │
│  │  ┌────────────────────┐            │                            │
│  │  │     A1B2C3         │            │                            │
│  │  └────────────────────┘            │                            │
│  │                                     │                            │
│  │  Your Name                          │                            │
│  │  ┌────────────────────┐            │                            │
│  │  │  Jane Smith        │            │                            │
│  │  └────────────────────┘            │                            │
│  │                                     │                            │
│  │  ┌────────────────────┐            │                            │
│  │  │    Join Quiz  →    │            │                            │
│  │  └────────────────────┘            │                            │
│  └────────────────────────────────────┘                            │
│                                                                      │
│  Don't have a code? Create your own quiz                            │
└─────────────────────────────────────────────────────────────────────┘
                            ↓ JOIN
┌─────────────────────────────────────────────────────────────────────┐
│                    WAITING ROOM                                      │
│  /quick-quiz/ABC123/take                                             │
│                                                                      │
│  Movie Trivia Night                                                  │
│  Hosted by John Doe                                                  │
│                                                                      │
│  ┌────────────────────────────────────┐                            │
│  │   ⏳ Waiting for host to start...  │                            │
│  │                                     │                            │
│  │   Participants (3):                 │                            │
│  │   • You (Jane Smith)                │                            │
│  │   • Emma Wilson                     │                            │
│  │   • Ryan Taylor                     │                            │
│  └────────────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
                            ↓ HOST STARTS
┌─────────────────────────────────────────────────────────────────────┐
│                    QUIZ IN PROGRESS                                  │
│  [Coming in Phase 2]                                                 │
│                                                                      │
│  Question 1 of 5                                    ⏱️ 00:28        │
│  ┌────────────────────────────────────────────────────┐            │
│  │  What year was The Matrix released?                │            │
│  └────────────────────────────────────────────────────┘            │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │  A) 1997         │  │  C) 1999         │                        │
│  └──────────────────┘  └──────────────────┘                        │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │  B) 1998         │  │  D) 2000         │                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │   Submit Answer       │                                          │
│  └───────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────────┘
                            ↓ COMPLETE
┌─────────────────────────────────────────────────────────────────────┐
│                     LEADERBOARD                                      │
│  [Coming in Phase 2]                                                 │
│                                                                      │
│  🏆 Final Results                                                    │
│                                                                      │
│  🥇 1st - Emma Wilson      - 850 pts                                │
│  🥈 2nd - Jane Smith (You) - 780 pts                                │
│  🥉 3rd - Ryan Taylor      - 650 pts                                │
│                                                                      │
│  ┌──────────────────┐  ┌─────────────────┐                        │
│  │  Play Again      │  │  Create Quiz    │                        │
│  └──────────────────┘  └─────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Components Gallery

### Landing Page CTA

```
┌───────────────────────────────────────────────────────┐
│                                                        │
│  ┌──────────────────────────────────────┐            │
│  │  ⚡ Create Quick Quiz          →     │            │
│  │  [Purple to Blue Gradient]            │            │
│  └──────────────────────────────────────┘            │
│                                                        │
│  ┌──────────────────────────────────────┐            │
│  │  Create Free Account           →     │            │
│  │  [Orange Gradient]                    │            │
│  └──────────────────────────────────────┘            │
│                                                        │
│  ┌──────────────────────────────────────┐            │
│  │  Sign In                              │            │
│  │  [Outlined White]                     │            │
│  └──────────────────────────────────────┘            │
└───────────────────────────────────────────────────────┘
```

### Join Code Display (Host Page)

```
┌─────────────────────────────────────────────────┐
│          Join Code                              │
│                                                 │
│                                                 │
│         A  1  B  2  C  3          📋           │
│       [7XL Font, Bold]           Copy          │
│                                                 │
│                                                 │
│  Share this code at:                            │
│  questEd.com/quick-quiz/join                   │
│                                                 │
│  [Purple to Blue Gradient Background]          │
└─────────────────────────────────────────────────┘
```

### Join Code Input (Join Page)

```
┌──────────────────────────────────────┐
│  Join Code                           │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │         A 1 B 2 C 3            │  │
│  │   [Large, Bold, Centered]      │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│  e.g., A1B2C3                        │
│                                      │
│  Your Name                           │
│  ┌────────────────────────────────┐  │
│  │  Jane Smith                    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Question Builder (Creator Page)

```
┌─────────────────────────────────────────────────┐
│  Question 1                          [X] Delete │
│                                                 │
│  Question Text                                  │
│  ┌───────────────────────────────────────────┐ │
│  │ What year was The Matrix released?       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Options                                        │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │ ○ A: 1997        │  │ ● C: 1999        │   │
│  └──────────────────┘  └──────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │ ○ B: 1998        │  │ ○ D: 2000        │   │
│  └──────────────────┘  └──────────────────┘   │
│                                                 │
│  ✓ Option C is marked as correct               │
└─────────────────────────────────────────────────┘
```

### Participant Waiting Room (Host Page)

```
┌─────────────────────────────────────────────┐
│  👥 Waiting Room (3 participants)           │
│                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │   JS   │  │   EM   │  │   RW   │       │
│  │  Jane  │  │  Emma  │  │  Ryan  │       │
│  │ Smith  │  │ Wilson │  │ Taylor │       │
│  └────────┘  └────────┘  └────────┘       │
│                                             │
│  [Gradient card backgrounds]                │
│  [Animated entrance when joining]           │
└─────────────────────────────────────────────┘
```

---

## 🔄 State Flow Diagram

### Quiz Creation Flow

```
User Input         → Validation       → API Call           → Database        → Response
─────────────────────────────────────────────────────────────────────────────────────
Title: "Movie"    → ✓ 3-100 chars   → POST /api/quick-  → Create Questions → 201 Created
Host: "John"      → ✓ 2-50 chars    →   quiz/create     → Create Test      → Return:
Time: 30s         → ✓ 10-120 range  → Body: {...}       → Generate Code    →   {
Questions: [...]  → ✓ 1-50 items    →                   → Save             →     _id,
                  → ✓ Each complete →                   →                  →     joinCode
                                                                            →   }
                                                         ↓
                                            Redirect to /quick-quiz/[id]/host?code=ABC123
```

### Quiz Joining Flow

```
User Input        → Validation       → API Call           → Database        → Response
─────────────────────────────────────────────────────────────────────────────────────
Code: "a1b2c3"   → ✓ 6 chars HEX   → POST /api/quick-  → Find Test by    → 200 OK
Name: "Jane"     → ✓ 2-30 chars    →   quiz/join       →   joinCode       → Return:
                 → ✓ Uppercase      → Body: {...}       → Check isActive  →   {
                 →   normalized     →                   → Check !complete →     test,
                                                                            →     name
                                                                            →   }
                                                         ↓
                                            Store in sessionStorage
                                                         ↓
                                            Redirect to /quick-quiz/[id]/take
```

---

## 📊 Feature Comparison Matrix

| Feature                  | Quick Quiz | Teacher Quiz | Student Account |
|--------------------------|------------|--------------|-----------------|
| Account Required         | ❌ No      | ✅ Yes       | ✅ Yes         |
| Time to Start            | 2 min      | 5-10 min     | N/A            |
| Quiz Management          | Basic      | Advanced     | N/A            |
| Result Persistence       | 🔄 Phase 2 | ✅ Yes       | ✅ Yes         |
| Analytics                | 🔄 Future  | ✅ Yes       | ✅ Yes         |
| Question Bank            | ❌ No      | ✅ Yes       | N/A            |
| Classroom Integration    | ❌ No      | ✅ Yes       | ✅ Yes         |
| Real-Time Leaderboard    | 🔄 Phase 2 | ✅ Yes       | ✅ Yes         |
| Quiz Templates           | 🔄 Future  | ✅ Yes       | N/A            |
| Export Results           | 🔄 Future  | ✅ Yes       | N/A            |
| Custom Branding          | 🔄 Future  | ✅ Yes       | N/A            |
| Team Mode                | 🔄 Future  | 🔄 Future    | 🔄 Future      |
| Best For                 | Casual use | Teaching     | Learning       |

✅ Available Now | 🔄 Coming Soon | ❌ Not Planned

---

## 🎯 Use Cases & Examples

### Use Case 1: Study Group
```
Scenario: College students preparing for exam
Steps:
  1. Sarah creates "Biology Final Review" quiz
  2. Adds 20 questions from study guide
  3. Shares code "B7C3A1" in group chat
  4. 8 friends join in 2 minutes
  5. Play together, discuss wrong answers
  6. Identify weak topics for more study

Time: 5 minutes setup, 20 minutes play
Value: Interactive review, identifies knowledge gaps
```

### Use Case 2: Party Game
```
Scenario: Friend gathering on Friday night
Steps:
  1. Host creates "Pop Culture Trivia" quiz
  2. Adds 15 fun questions about movies/music
  3. Displays join code on TV: "F2E8D4"
  4. Guests join on phones as they arrive
  5. Play during dinner, see leaderboard
  6. Winner gets bragging rights

Time: 3 minutes setup, 10 minutes play
Value: Social entertainment, breaks the ice
```

### Use Case 3: Team Building
```
Scenario: Remote team bonding activity
Steps:
  1. Manager creates "Know Your Team" quiz
  2. Fun questions about team members
  3. Shares code in Slack: "C4A9F1"
  4. Team joins video call + quiz
  5. Answer questions about each other
  6. Laugh at funny responses

Time: 5 minutes setup, 15 minutes play
Value: Team connection, learn about colleagues
```

### Use Case 4: Classroom Quick Check
```
Scenario: Teacher wants to gauge understanding
Steps:
  1. Teacher creates "Chapter 5 Review" quiz
  2. 5 questions on today's lesson
  3. Projects code on screen: "D1A3B7"
  4. Students join on devices
  5. Instant feedback on comprehension
  6. Re-teach confusing topics

Time: 2 minutes setup, 5 minutes play
Value: Real-time assessment, adaptive teaching
```

---

## 💡 Tips & Best Practices

### For Quiz Creators

**Creating Engaging Questions:**
- ✅ Keep questions short and clear
- ✅ Make all options plausible
- ✅ Vary difficulty (easy → hard)
- ✅ Add fun/interesting facts
- ❌ Avoid ambiguous wording
- ❌ Don't make it too easy

**Optimal Quiz Settings:**
- **Time per question:**
  - Easy questions: 15-20 seconds
  - Medium questions: 25-35 seconds
  - Hard questions: 40-60 seconds
- **Number of questions:**
  - Quick game: 5-10 questions
  - Standard game: 15-20 questions
  - Deep dive: 30-50 questions
- **Topic focus:**
  - Single topic = better flow
  - Mixed topics = more variety

**Sharing Join Codes:**
- 📱 Text message (personal)
- 💬 Group chat (Discord, Slack)
- 📧 Email (formal settings)
- 📺 Display on screen (in-person)
- 🔗 Share full link + code

### For Participants

**Joining Tips:**
- ✅ Enter code carefully (case doesn't matter)
- ✅ Use recognizable name
- ✅ Join early to test connection
- ✅ Keep quiz page open
- ❌ Don't refresh during quiz

**Playing Tips:**
- Read questions fully before answering
- Watch the timer (top right)
- Don't stress - it's for fun!
- Check leaderboard after each question
- Learn from wrong answers

---

## 🔐 Security & Privacy

### What We Collect (Quick Quiz)

**Host Creates Quiz:**
- Quiz title (public)
- Host name (public, no email)
- Questions and answers (public)
- Join code (public - shareable)
- Creation timestamp

**Participant Joins:**
- Participant name (sessionStorage only)
- Join timestamp
- No email, no password, no account

### What We DON'T Collect

- ❌ Email addresses
- ❌ Phone numbers
- ❌ IP addresses (not stored)
- ❌ Location data
- ❌ Payment info
- ❌ Personal identifiers

### Data Retention

- **Quiz data:** 24 hours (auto-delete)
- **Join codes:** Expire with quiz
- **Participant names:** sessionStorage (browser only)
- **Results:** Not stored (Phase 2 will add option)

### Privacy Features

- No tracking cookies
- No advertising
- No third-party data sharing
- No account required
- Minimal data collection

---

## ⚡ Quick Reference: URLs

### Public Pages (No Auth)
```
Homepage:           https://questEd.com
Create Quick Quiz:  https://questEd.com/quick-quiz
Join Quick Quiz:    https://questEd.com/quick-quiz/join
Host Page:          https://questEd.com/quick-quiz/[id]/host
Take Quiz:          https://questEd.com/quick-quiz/[id]/take
Results:            https://questEd.com/quick-quiz/[id]/results
```

### API Endpoints
```
Create:   POST   /api/quick-quiz/create
Details:  GET    /api/quick-quiz/[id]
Join:     POST   /api/quick-quiz/join
Start:    POST   /api/quick-quiz/[id]/start
Submit:   POST   /api/quick-quiz/[id]/submit
Results:  GET    /api/quick-quiz/[id]/results
```

### Authenticated Pages (Existing)
```
Login:              https://questEd.com/login
Signup:             https://questEd.com/signup
Teacher Dashboard:  https://questEd.com/dashboard/teacher
Student Dashboard:  https://questEd.com/dashboard/student
```

---

## 🎉 Feature Highlights

### What Makes Quick Quiz Special

1. **Zero Friction**
   - No signup, no login, no download
   - Create quiz in 2 minutes
   - Join in 30 seconds

2. **Universal Access**
   - Works on any device
   - No app installation
   - Just a web browser

3. **Social by Design**
   - Easy code sharing
   - Real-time participation
   - Competitive leaderboard

4. **Privacy-First**
   - Minimal data collection
   - No tracking
   - Auto-expiring quizzes

5. **Beautiful UI**
   - Modern gradient design
   - Smooth animations
   - Mobile-optimized

---

## 📈 Roadmap Visual

```
MVP (Current)              Phase 2 (Next)           Phase 3 (Future)
─────────────────────────────────────────────────────────────────
✅ Create quiz            🔄 Take quiz live        🔮 Quiz templates
✅ Generate code          🔄 Real-time updates     🔮 Image questions
✅ Join with code         🔄 Live leaderboard      🔮 Team mode
✅ Host waiting room      🔄 Submit answers        🔮 Custom themes
✅ Landing page CTA       🔄 Store results         🔮 Social sharing
✅ Responsive design      🔄 Results page          🔮 Advanced stats
✅ Error handling         🔄 Host controls         🔮 Export results
✅ Documentation          🔄 Submission tracking   🔮 Quiz passwords

Status: COMPLETE          Timeline: 1-2 weeks      Timeline: 1-2 months
```

---

**Documentation Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** QuestEd Team  
**Feedback:** Please report issues or suggestions!
