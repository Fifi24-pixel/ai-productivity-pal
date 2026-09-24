# WorkFlow AI

> An enterprise-grade AI productivity suite tailored for modern professionals to streamline communication, synthesize discussions, structure priorities, and safeguard deep work time.

---

## 📌 Project Overview

**WorkFlow AI** is a responsive web application designed to eliminate friction in daily professional workflows. By automating repetitive administrative tasks—such as drafting nuanced correspondence, extracting action items from lengthy meetings, and prioritizing chaotic task lists—WorkFlow AI frees knowledge workers to focus on high-leverage problem solving.

The platform combines a calm, low-glare user experience with standardized responsible AI practices, deep work timers, and centralized loading indicators.

---

## 🚀 Features Implemented

### 1. ✉️ Smart Email Generator (`/smart-email`)
- **Context-Aware Drafting**: Formulates emails from raw goals or conversation context.
- **Tone & Audience Tuning**: Custom selectors for tone (*Formal*, *Informal*, *Persuasive*) and target audience (*Client*, *Manager*, *Team*).
- **One-Click Actions**: Quick copy-to-clipboard button with visual confirmation.

### 2. 📝 Meeting Notes Summarizer (`/meeting-summarizer`)
- **Transcript Synthesis**: Ingests unstructured meeting notes and transcripts.
- **Structured Outputs**:
  - **Executive Summary**: High-level synopsis of the discussion.
  - **Action Items & Responsibilities**: Interactive task checklist with designated owners.
  - **Deadlines**: Color-coded badges highlighting delivery dates and urgency.

### 3. 📋 AI Task Planner & Scheduler (`/task-planner`)
- **Braindump Parsing**: Accepts unformatted task lists (one per line).
- **Priority Matrix**: Automatically sorts tasks into three tiers:
  - *High Priority / Do Today*
  - *Medium Priority / Schedule*
  - *Low Priority / Delegate*
- **Time Optimization Tips**: Actionable scheduling recommendations based on cognitive load.

### 4. ⏱️ Focus Timer (`/focus-timer`)
- **Deep Work Cycles**: Structured interval timer (default 20 min focus / 5 min rest).
- **Customizable Durations**: Editable session lengths that save for future sprints.
- **Visual Progress & Metrics**: Live countdown, animated progress bar, and cycle counter.

### 5. 🌿 Wellness & User Experience
- **Hourly Motivation Bubble**: Non-intrusive wellness dialog appearing at launch and hourly intervals with rotating affirmations.
- **Dual Eye-Care Theme**: Calibrated light mode and a warm, low-contrast dark mode designed to reduce eye strain during extended screen sessions.
- **Responsible AI Disclaimer**: Persistent header banner ensuring transparency regarding AI-generated output.

---

## 🛠️ Technologies & Tools Used

- **Framework**: [TanStack Start v1](https://tanstack.com/start) & [React 19](https://react.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (type-safe, file-based routing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with semantic OKLCH color palettes
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Package Manager & Bundler**: [Bun](https://bun.sh/) / [Vite 7](https://vitejs.dev/)
- **State & Architecture**: Centralized React Context (`LoadingContext`) and modular AI service abstraction layer (`src/lib/ai-service.ts`)

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v20+ recommended) or **Bun** (v1.1+)
- **Git**

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd workflow-ai


