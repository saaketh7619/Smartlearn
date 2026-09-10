# SmartLearn — AI-Powered Smart Education Ecosystem

> A unified, beautifully crafted education ecosystem bringing **Students**, **Teachers**, **Parents**, and **Administrators** together on one platform with a shared visual language and a shared brain.

---

## 🌟 Quick Overview & Portal Capabilities

| Portal | Accent Color | Primary Highlights |
| :--- | :--- | :--- |
| **Student Portal** | **Royal Blue** (`#2563eb`) | Adaptive Mock Tests with real-time difficulty scaling, AI Doubt Tutor with step-by-step math derivations, AI Study Timetable Planner, AI Revision Flashcards, Rich Notebook with AI synthesis, Focus Mode with Pomodoro & ambient audio, visual Recharts topic mastery, and gamified XP/Badges with celebratory confetti. |
| **Teacher Portal** | **Deep Purple** (`#7c3aed`) | Class average performance, "Students Needing Attention" alert panel, Common Weak Topics bar chart, AI Question Paper & 5E Lesson Plan Generator, Test Creator with browser Page Visibility tab-switch anti-cheating detection, Exam Mistake Classification Analyzer, and direct messaging. |
| **Parent Portal** | **Emerald Green** (`#059669`) | Multi-child switcher (Alex & Maya), circular progress ring, reassuring plain-language activity feed, Web Speech API **Read Aloud** voice summaries, regional language toggles (English, Hindi, Spanish), smart alerts, and teacher messaging. |
| **Admin Console** | **Amber Orange** (`#d97706`) | Operational command center with KPI stat cards, 30-day engagement trend chart, full User Management table with Role-Based Access Control (RBAC), Content Moderation Queue, and Support Ticket tracking. |

---

## 🚀 One-Click Demo Credentials (Zero Friction)

You can launch any role with **1-click** right from the landing page or use the role switcher dropdown in the top navigation bar:

| Role | Demo Persona | Email | Password / OTP | Default Redirect |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | **Alex Rivera** (Grade 10) | `student@smartlearn.edu` | `123456` | `/student` |
| **Teacher** | **Dr. Sarah Jenkins** (Head of Math) | `teacher@smartlearn.edu` | `123456` | `/teacher` |
| **Parent** | **Priya Sharma** (Alex & Maya's Mother) | `parent@smartlearn.edu` | `123456` | `/parent` |
| **Admin** | **Marcus Vance** (Principal Admin) | `admin@smartlearn.edu` | `123456` | `/admin` |

*Note: For manual login via email or mobile phone, the simulated OTP code `123456` is accepted on all accounts.*

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24.19)
- **npm**: v9.0.0 or later

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm run test

# 3. Build for production
npm run build

# 4. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Omni Command Palette (`Ctrl+K` / `Cmd+K`)
Press <kbd>Ctrl+K</kbd> or <kbd>⌘K</kbd> anywhere in the application to trigger the **Omni Command Palette** to jump to any dashboard, test, AI tool, toggle Dark/Light mode, or instantly switch personas.

---

## 🔍 Technical Architecture & Transparency Note

### What is Fully & Genuinely Implemented
- **Adaptive Difficulty Testing Engine**: Real-time evaluation of question answer streaks that dynamically adjusts question difficulty tiers (`Easy` ➔ `Medium` ➔ `Hard` ➔ `Olympiad`) during live tests, with auto-submission on timer expiry.
- **Browser Page Visibility API Anti-Cheating**: Real-time detection and logging whenever a student tabs away or minimizes their browser window during an exam.
- **Data Visualization & Analytics**: Recharts Line, Bar, Radar, and Pie charts displaying topic competencies, student mistake classifications (Conceptual vs Careless vs Time), and progress trends.
- **Zustand Reactive Store**: Persistent client state management for theme toggles, internationalization (`en`, `hi`, `es`), notifications, and gamification XP/badge level-ups with `canvas-confetti`.
- **Web Speech API Read Aloud**: Fully functional voice synthesis on parent summaries.
- **Role-Based Access Control (RBAC)**: Enforced user permissions, role reassignments, and complete Prisma PostgreSQL-ready schema (`prisma/schema.prisma`).
- **Comprehensive Mock Dataset**: Pre-seeded with 30 students, 5 teachers, 10 parents, 1 admin, 15 courses, test question banks, submissions, and moderation items.

### What is Simulated or Stubbed
- **SMS / Email Carrier Gateway**: Real SMS delivery via Twilio/AWS SNS is stubbed with an in-memory OTP verification provider; the UI accepts the standard demo verification code `123456` or the generated code displayed on the screen.
- **Cloud LLM API**: The AI Doubt Tutor, Question Paper Generator, and Revision Flashcard Synthesizer use high-speed deterministic heuristic knowledge bases with real mathematical reasoning and LaTeX derivations rather than requiring an external paid OpenAI/Anthropic API key. An external LLM endpoint can be dropped into `src/app/api/ai/*` with 1 line of configuration.
