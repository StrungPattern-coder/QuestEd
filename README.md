# 🎓 QuestEd

**A completely free and open-source alternative to Kahoot** - Interactive quiz platform with gamification, real-time features, and zero paywalls.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.5-green)](https://www.mongodb.com/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

> **Live Demo**: [quest-ed-phi.vercel.app](https://quest-ed-phi.vercel.app)  
> **Security Audit**: [View Report](SECURITY_AUDIT_REPORT.md)

---

## 🚀 Why QuestEd?

Educators shouldn't pay for basic features when they're just trying to make learning engaging. QuestEd combines the best of **Kahoot's live interaction** with **Duolingo's gamification** - completely free, forever.

### ⚡ Key Features

**For Teachers** 👨‍🏫
- ✅ **Live Quiz Sessions** (up to 200 concurrent participants on free tier)
- ✅ **Question Bank Management** - 500+ pre-loaded questions, CSV/JSON import
- ✅ **Classroom Management** - Email invitations, join codes, student tracking
- ✅ **Multiple Quiz Modes** - Live (Kahoot-style) or Deadline (self-paced)
- ✅ **Real-time Analytics** - Scores, rankings, submission tracking, late penalties
- ✅ **Template System** - Pre-built quiz templates to get started fast
- ✅ **Microsoft Teams Integration** - **NEW!** Import Teams classrooms & students automatically

**For Students** 👨‍🎓
- ✅ **Daily Challenges** - Question of the Day with streaks
- ✅ **Quick Quiz** - Practice mode with 500+ questions
- ✅ **Gamification** - Streaks, badges, celebrations, podium animations
- ✅ **Progress Tracking** - Personal stats, leaderboards, achievement system
- ✅ **Mobile-First Design** - Works flawlessly on all devices
- ✅ **Multi-language Support** - Built-in i18n (English, German, more coming)

**Real-time Features** ⚡
- Live quiz broadcasting with WebSocket (Ably)
- Real-time leaderboard updates
- Connected participants counter
- Auto-advancing questions
- Instant score calculations
- Teacher controls (pause, skip, end)

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 (App Router, React Server Components)
- TypeScript 5.5
- Tailwind CSS + Shadcn UI
- Framer Motion (animations)
- Canvas Confetti (celebrations)

**Backend**
- Next.js API Routes (serverless)
- Express.js (middleware)
- MongoDB + Mongoose
- JWT Authentication (bcrypt)
- Nodemailer (email system)
- Microsoft Graph API (Teams integration)

**Real-time & Infrastructure**
- Ably (WebSocket communication)
- Vercel (deployment, CDN, serverless functions)
- MongoDB Atlas (cloud database)

**Security** 🔒
- Rate limiting (brute-force protection)
- Input sanitization (NoSQL injection prevention)
- Security headers (XSS, clickjacking protection)
- JWT with HTTP-only cookies
- bcrypt password hashing (10 rounds)
- HTTPS enforced in production

---

## 🚀 Quick Start

Ready to get started? Check out our [**Getting Started Guide**](GETTING_STARTED.md) for complete setup instructions.

**Quick overview:**
1. Clone the repository
2. Install dependencies (`npm install`)
3. Set up environment variables (MongoDB, Ably, JWT)
4. Run development server (`npm run dev`)

**[📖 View Full Setup Guide →](GETTING_STARTED.md)**

---

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs) folder:

### Essential Guides
- **[Getting Started](GETTING_STARTED.md)** - Complete setup walkthrough
- **[Security Audit Report](SECURITY_AUDIT_REPORT.md)** - Vulnerability analysis & fixes
- **[Email Setup (5 min)](./docs/EMAIL_QUICKSTART.md)** - Configure email invitations
- **[Azure AD Setup (NEW!)](./docs/AZURE_AD_SETUP_GUIDE.md)** - Visual guide for Microsoft Teams registration
- **[Microsoft Teams Sync (NEW!)](./docs/TEAMS_SYNC_QUICKSTART.md)** - Import classrooms & students automatically
- **[Microsoft Teams Integration](./docs/TEAMS_INTEGRATION.md)** - Full Teams integration guide
- **[i18n Guide](./docs/I18N_GUIDE.md)** - Multiple language support
- **[Project Summary](./docs/PROJECT_SUMMARY.md)** - Complete architecture overview

**[📂 View All Documentation →](./docs/README.md)**

---

## 🤝 Contributing

We actively welcome contributions! Whether you're fixing bugs, adding features, improving docs, or suggesting ideas - all contributions are valued.

**How to Contribute:**
1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Fork the repository
3. Create feature branch (`git checkout -b feature/amazing-feature`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

**Good First Issues:**
- 🟢 Add new language translations
- 🟢 Improve mobile responsiveness
- 🟢 Add more quiz templates
- 🟢 Write unit tests

**[👉 See Full Contribution Guidelines →](CONTRIBUTING.md)**

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

**TL;DR:** You can use, modify, distribute this project for free, even commercially. Just keep the license notice.

---

## 📜 Attribution

If you use QuestEd in your project, please:
- ⭐ Star this repository
- 🔗 Link back to https://github.com/StrungPattern-coder/QuestEd
- 📝 Mention "Built with QuestEd by Sriram Kommalapudi" in your docs

While not legally required, it helps the project grow!

---

## ⭐ Show Your Support

If you find QuestEd useful, here's how you can help:

- ⭐ **Star this repository** - It helps others discover the project
- 🍴 **Fork and contribute** - See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- 📢 **Share with educators** - Spread the word about free ed-tech tools
- 🐛 **Report bugs** - Help us improve by [opening issues](https://github.com/StrungPattern-coder/QuestEd/issues)
- 💡 **Suggest features** - We're always looking for new ideas
- 📝 **Write about it** - Blog posts, tutorials, or reviews are appreciated

Every contribution, no matter how small, makes a difference! 🙏

---

## 💬 Support

For issues or questions:
- **GitHub Issues**: [Report bugs or request features](https://github.com/StrungPattern-coder/QuestEd/issues)
- **Email**: connect.help83@gmail.com
- **Documentation**: [Browse all docs](docs/)

---

## 💰 Pricing

**Completely Free!** 🎉

- ✅ Up to **200 concurrent users** at the same time (Ably free tier)
- ✅ Unlimited total users
- ✅ Unlimited quizzes and questions
- ✅ All features included (no premium tiers)
- ✅ Open-source (MIT License)

**Note**: For more than 200 concurrent users, you'll need to upgrade to Ably's paid tier (~$29-299/month depending on scale). See [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) for scaling details.

---

**Built with ❤️ for educators worldwide**

**Stack**: Next.js 15 · TypeScript · MongoDB · Ably · Tailwind CSS · Shadcn UI · Framer Motion
