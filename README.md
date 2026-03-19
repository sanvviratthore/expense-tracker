# Spendly — Expense Tracker App

A mobile expense tracking app built with Expo and React Native.

## Features

- Add, edit, delete expenses (amount, category, date, note)
- 8 spending categories with color coding
- Dashboard with monthly total and expense list
- Category breakdown with progress bars
- Monthly navigation — browse any month
- Persistent local storage via AsyncStorage
- Crash-free on Android emulator

## Scoping Decisions

**What I built (core):**
- Full CRUD for expenses
- Category-based breakdown with subtotals and % bars
- Summary dashboard with monthly totals
- Monthly navigation
- AsyncStorage persistence

**What I scoped out (and why):**
- Pie/bar charts — avoided Victory Native dependency to reduce build complexity and keep the app crash-free within the time window. The progress bar breakdown communicates the same information effectively.
- Biometric lock — requires native module setup, significant setup time for marginal UX value in a demo
- CSV export — nice to have but not core to the tracking experience

## Tech Choices

| Choice | Reason |
|--------|--------|
| Expo SDK 51 | Managed workflow, no native build config needed |
| Expo Router | File-based routing, clean navigation structure |
| AsyncStorage | Simple, reliable local persistence, no backend needed |
| No external UI lib | Keeps bundle small, full control over dark theme |

## Setup & Run

```bash
npm install
npx expo start --android
```

Make sure Android Studio is open with an emulator running before starting.

## Project Structure

```
spendly/
├── app/
│   ├── _layout.jsx      # Tab navigation
│   ├── index.jsx        # Dashboard screen
│   ├── categories.jsx   # Category breakdown
│   └── add.jsx          # Add/Edit expense
├── components/
│   ├── ExpenseItem.jsx
│   └── SummaryCard.jsx
├── store/
│   └── expenses.js      # AsyncStorage logic
├── constants/
│   └── categories.js
└── app.json
```

## Demo
https://youtube.com/shorts/zzPR_Q8IjQg?feature=share
