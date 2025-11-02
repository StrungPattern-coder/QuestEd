# 🤝 Contributing to QuestEd

First off, thank you for considering contributing to QuestEd! It's people like you that make this platform better for educators and students worldwide.

## 🌟 Why Contribute?

- **Make an Impact**: Help educators teach better, help students learn better
- **Learn & Grow**: Work with modern tech stack (Next.js 15, TypeScript, MongoDB)
- **Open Source**: Build your portfolio with real-world contributions
- **Community**: Join me and my friendly community of developers and educators

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Coding Guidelines](#-coding-guidelines)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Good First Issues](#-good-first-issues)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints and experiences
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community
- ✅ Showing empathy towards other community members

**Unacceptable behavior:**
- ❌ Trolling, insulting/derogatory comments, personal or political attacks
- ❌ Public or private harassment
- ❌ Publishing others' private information without permission
- ❌ Other conduct which could reasonably be considered inappropriate

---

## 🚀 How Can I Contribute?

### 1. Reporting Bugs 🐛

**Before submitting a bug report:**
- Check the [existing issues](https://github.com/StrungPattern-coder/QuestEd/issues) to avoid duplicates
- Try the latest version - the bug might already be fixed
- Check the documentation - maybe it's a usage issue

**How to submit a good bug report:**

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome 96, Firefox 95]
- Node.js version: [e.g., 18.17.0]
- QuestEd version: [e.g., commit hash or release]

**Additional Context**
Any other context about the problem.
```

### 2. Suggesting Features 💡

**Before suggesting a feature:**
- Check if the feature already exists in the latest version
- Search [existing feature requests](https://github.com/StrungPattern-coder/QuestEd/issues?q=is%3Aissue+label%3Aenhancement)
- Consider if it fits the project's scope and goals

**How to submit a good feature request:**

```markdown
**Feature Description**
A clear and concise description of what you want to happen.

**Use Case**
Why is this feature needed? Who will benefit from it?

**Proposed Solution**
How do you envision this feature working?

**Alternatives Considered**
What other approaches have you thought about?

**Additional Context**
Any mockups, examples, or references.
```

### 3. Contributing Code 💻

We love code contributions! Here's how to get started:

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js 18+** and npm
- **Git**
- **MongoDB Atlas account** (free tier)
- **Ably account** (free tier)
- **Gmail account** (optional, for email features)

### Fork & Clone

```bash
# 1. Fork the repository on GitHub
# Click the "Fork" button at https://github.com/StrungPattern-coder/QuestEd

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/QuestEd.git
cd QuestEd

# 3. Add upstream remote
git remote add upstream https://github.com/StrungPattern-coder/QuestEd.git

# 4. Verify remotes
git remote -v
# Should show:
# origin    https://github.com/YOUR-USERNAME/QuestEd.git (fetch)
# origin    https://github.com/YOUR-USERNAME/QuestEd.git (push)
# upstream  https://github.com/StrungPattern-coder/QuestEd.git (fetch)
# upstream  https://github.com/StrungPattern-coder/QuestEd.git (push)
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
# Required: MONGO_URI, JWT_SECRET, ABLY_API_KEY, NEXT_PUBLIC_ABLY_CLIENT_KEY
```

**Quick Setup Guides:**
- [MongoDB Setup](docs/GETTING_STARTED.md)
- [Email Setup (5 min)](docs/EMAIL_QUICKSTART.md)
- [Ably Setup](https://ably.com) - Sign up → Create app → Copy keys

### Run Development Server

```bash
# Start Next.js development server
npm run dev

# Server runs on http://localhost:3000
```

### Verify Setup

1. Open browser to `http://localhost:3000`
2. Try creating a teacher account
3. Try creating a student account
4. Verify login works for both

---

## 📁 Project Structure

Understanding the codebase structure will help you navigate and contribute effectively:

```
QuestEd/
├── app/                    # Next.js 15 App Router
│   ├── api/                # API Routes (serverless functions)
│   │   ├── auth/           # Authentication (signup, login, password reset)
│   │   ├── teacher/        # Teacher endpoints (classrooms, tests, analytics)
│   │   ├── student/        # Student endpoints (tests, qotd, quick-quiz)
│   │   └── ably/           # Real-time token generation
│   ├── dashboard/          # Dashboard pages
│   │   ├── teacher/        # Teacher dashboard & features
│   │   └── student/        # Student dashboard & features
│   ├── login/              # Login page
│   ├── signup/             # Multi-step signup wizard
│   ├── tests/              # Test taking & results pages
│   ├── quick-quiz/         # Practice mode
│   └── templates/          # Quiz template library
│
├── backend/                # Express backend (development only)
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, rate limiting, sanitization, security
│   ├── models/             # MongoDB schemas (User, Test, Classroom, etc.)
│   ├── routes/             # Express route handlers
│   └── utils/              # Helper functions (db, email, etc.)
│
├── components/             # React components
│   ├── ui/                 # Shadcn UI components (button, dialog, etc.)
│   ├── Aurora.tsx          # Animated background
│   ├── QuestionOfTheDay.tsx # Daily challenge component
│   ├── StreakIndicator.tsx  # Gamification UI
│   └── [40+ more components]
│
├── lib/                    # Utility libraries
│   ├── ably.ts             # Ably real-time client configuration
│   ├── api.ts              # API wrapper with auth headers
│   ├── store.ts            # Zustand global state management
│   └── utils.ts            # Common utility functions
│
├── docs/                   # Documentation (30+ files)
│   ├── SECURITY_AUDIT_REPORT.md
│   ├── GETTING_STARTED.md
│   ├── I18N_GUIDE.md
│   └── [more docs]
│
└── public/                 # Static assets
    ├── banner-images/      # Login/signup banners
    └── [logos, fonts, etc.]
```

### Key Files to Know

- **`app/api/*`**: All serverless API endpoints
- **`backend/models/*`**: MongoDB schemas
- **`components/ui/*`**: Reusable UI components
- **`lib/api.ts`**: API client with authentication
- **`backend/middleware/auth.ts`**: JWT authentication logic

---

## 📝 Coding Guidelines

### TypeScript

✅ **Do:**
```typescript
// Use explicit types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

// Use proper error handling
try {
  const user = await fetchUser(id);
  return user;
} catch (error) {
  console.error('Failed to fetch user:', error);
  throw new Error('User not found');
}
```

❌ **Don't:**
```typescript
// Avoid 'any' type
const user: any = await fetchUser(id);

// Avoid unhandled promises
fetchUser(id).then(user => console.log(user));
```

### React Components

✅ **Do:**
```typescript
// Use functional components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

❌ **Don't:**
```typescript
// Avoid class components (use functional)
class Button extends React.Component {
  // ...
}
```

### API Routes

✅ **Do:**
```typescript
// Use proper Next.js 15 API route format
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process request
    const result = await processData(body);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Styling

✅ **Do:**
```typescript
// Use Tailwind CSS utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>

// Use Shadcn UI components when available
import { Button } from '@/components/ui/button';
<Button variant="default" size="lg">Click Me</Button>
```

❌ **Don't:**
```typescript
// Avoid inline styles (use Tailwind)
<div style={{ padding: '16px', backgroundColor: 'white' }}>
```

### Error Handling

✅ **Do:**
```typescript
// Provide user-friendly error messages
if (!classroom) {
  return NextResponse.json(
    { error: 'Classroom not found' },
    { status: 404 }
  );
}

// Log errors for debugging (server-side only)
console.error('[API Error]:', error);
```

---

## 📦 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history:

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature/bug change)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, tooling

### Examples

```bash
# Good commits
git commit -m "feat(teacher): add CSV export for test results"
git commit -m "fix(auth): resolve JWT token expiration issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): format code with prettier"
git commit -m "refactor(api): simplify error handling logic"

# Detailed commit
git commit -m "feat(student): add Question of the Day feature

- Add daily question fetching API
- Implement streak tracking
- Add celebration animations for correct answers
- Update student dashboard with QOTD widget

Closes #123"
```

---

## 🔀 Pull Request Process

### Before Submitting

1. **Create a feature branch**
```bash
git checkout -b feature/my-awesome-feature
```

2. **Keep your branch updated**
```bash
git fetch upstream
git rebase upstream/main
```

3. **Test your changes**
```bash
# Run the development server
npm run dev

# Test all affected features manually
# Ensure no console errors
```

4. **Check code quality**
```bash
# TypeScript type check
npm run type-check

# Lint code
npm run lint
```

### Submitting Pull Request

1. **Push to your fork**
```bash
git push origin feature/my-awesome-feature
```

2. **Create Pull Request on GitHub**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Closes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
Add screenshots to demonstrate visual changes.

## Checklist
- [ ] My code follows the project's coding guidelines
- [ ] I have tested my changes locally
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation (if needed)
- [ ] My changes generate no new warnings
- [ ] I have added tests (if applicable)
```

### Review Process

- Maintainers will review your PR within 1-3 days
- Address review comments by pushing new commits
- Once approved, your PR will be merged!

---

## 🎯 Good First Issues

Perfect for new contributors:

### 🟢 Easy (1-2 hours)

1. **Add Language Translation**
   - File: `lib/translations.ts`
   - Add translations for a new language
   - See: [I18N Guide](docs/I18N_GUIDE.md)

2. **Add More Quiz Templates**
   - File: `app/templates/page.tsx`
   - Create new quiz topic templates
   - Requires: 20-30 questions per template

3. **Improve Mobile Responsiveness**
   - Test on mobile devices
   - Fix any layout issues
   - Use Tailwind responsive classes

4. **Add Loading Skeletons**
   - Replace loading spinners with skeleton screens
   - Use Shadcn UI skeleton component
   - Better UX during data fetching

### 🟡 Medium (3-6 hours)

5. **Add Question Image Support**
   - Allow images in questions
   - Implement image upload
   - Files: Question model, question bank API

6. **Implement Light Mode**
   - Add light mode toggle
   - Use Tailwind light: classes
   - Persist preference in localStorage

7. **Export Test Results to PDF**
   - Use library like jsPDF
   - Format results nicely
   - Add charts/graphs

### 🔴 Advanced (1-2 days)

9. **Add Voice Questions**
   - Text-to-speech for questions
   - Record audio answers
   - Requires: Audio API integration

10. **Implement Redis Rate Limiting**
    - Replace in-memory rate limiting
    - Use Upstash Redis
    - Files: `backend/middleware/rateLimiter.ts`

11. **Add Advanced Analytics**
    - Learning curve charts
    - Student performance trends
    - Question difficulty analysis

12. **Create Mobile App**
    - Use React Native
    - Share business logic
    - Cross-platform iOS/Android

---

## 🌐 Translation Contributions

We welcome translations to make QuestEd accessible worldwide!

**How to add a new language:**

1. Open `lib/translations.ts`
2. Add your language code and translations
3. Follow existing structure
4. Test by switching language in UI

Example:
```typescript
export const translations = {
  en: { /* English translations */ },
  de: { /* German translations */ },
  es: { /* Add Spanish translations here */ },
  // Add your language
};
```

See [I18N Guide](docs/I18N_GUIDE.md) for detailed instructions.

---

## 📚 Documentation Contributions

Good documentation is just as valuable as code!

**Ways to help:**
- Fix typos and grammar
- Add missing documentation
- Create tutorials and guides
- Add code examples
- Improve existing docs

**Documentation files are in:**
- `README.md` - Main project README
- `docs/` - All feature documentation
- Code comments - Inline documentation

---

## 🐛 Testing

Currently, QuestEd relies on manual testing. **We'd love help adding automated tests!**

**Test ideas:**
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Component tests for React components

**Frameworks to use:**
- Jest (unit tests)
- React Testing Library (component tests)
- Playwright or Cypress (E2E tests)

---

## ❓ Questions?

- **General questions**: Open a [GitHub Discussion](https://github.com/StrungPattern-coder/QuestEd/discussions)
- **Bug reports**: Open an [Issue](https://github.com/StrungPattern-coder/QuestEd/issues/new)
- **Email**: connect.help83@gmail.com
- **Documentation**: Check [/docs](docs/)

---

## 🎉 Recognition

All contributors will be:
- Added to the Contributors list
- Mentioned in release notes
- Forever appreciated by the community! ❤️

---

## 📜 License

By contributing to QuestEd, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making QuestEd better! 🚀**

Happy coding! 💻✨
