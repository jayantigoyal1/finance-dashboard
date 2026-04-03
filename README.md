# Ledger — Finance Dashboard

A clean, editorial-style personal finance dashboard built with **React**, **JavaScript**, and **Tailwind CSS**.  

---

## Project Structure

```
src/
├── components/
│   ├── Card.jsx              # Reusable stat summary card
│   ├── Dashboard.jsx         # Overview page (charts + summary)
│   ├── Header.jsx            # Nav bar, ticker strip, role switcher
│   ├── Insights.jsx          # Analytics & pattern view
│   └── TransactionsTable.jsx # Filterable, sortable transaction list
├── context/
│   └── AppContext.jsx        # Global state via React Context
├── data/
│   └── mockData.js           # Seed transactions + category config
├── hooks/
│   └── useFinanceInsights.js # Derived analytics (custom hook)
├── utils/
│   └── formatters.js         # Currency & date formatting helpers
├── App.jsx                   # Root component, view routing
├── index.css                 # Global styles + Tailwind imports
└── main.jsx                  # React entry point
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → App runs at http://localhost:5173

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## Features

### Dashboard Overview
- **4 Summary Cards** — Net Balance, Total Income, Total Expenses, Transaction Count
- **Monthly Cash Flow** — Grouped bar chart (Income / Expenses / Net per month)
- **Spending Donut** — Category breakdown with hover interaction
- **Recent Activity** — Latest 6 transactions with type/category color coding

### Transactions
- Full sortable, filterable transaction table
- **Search** by description or category (live)
- **Filter by type** — All / Income / Expense
- **Filter by category** — dropdown
- **Sort** by date or amount, ascending/descending
- Per-row hover states and staggered slide-in animation

### Role-Based UI
Switch roles in the header dropdown:

| Role   | Capabilities                                      |
|--------|---------------------------------------------------|
| Admin  | View all data, add new transactions, delete rows  |
| Viewer | Read-only; add/delete controls hidden; banner shown |

No auth required — role switch is instant via the dropdown.

### Insights
- **Top Spending Category** — highest spend with color coding
- **Savings Rate** — with contextual pass/fail indicator
- **Average Expense Size** — mean per transaction
- **Net Position** — income vs expenses summary
- Monthly Net Income area chart
- Income vs Expenses grouped bar chart
- Category ranking with animated progress bars + donut chart

---

## State Management

All application state lives in `src/context/AppContext.jsx` using React Context + `useState` / `useMemo`:

| State               | Purpose                               |
|---------------------|---------------------------------------|
| `transactions`      | Source-of-truth data array            |
| `role`              | Current user role (`admin`/`viewer`)  |
| `activeTab`         | Current navigation view               |
| `filterType`        | Type filter for transactions          |
| `filterCategory`    | Category filter for transactions      |
| `search`            | Live search string                    |
| `sortBy / sortDir`  | Sort field and direction              |
| `showAddModal`      | Controls add-transaction modal        |

Derived state (`filteredTransactions`, `stats`) is computed with `useMemo` to avoid unnecessary recalculation.

Analytics logic is further separated into `src/hooks/useFinanceInsights.js`, keeping components clean.

---

## Design Decisions

| Decision        | Choice                                                          |
|-----------------|-----------------------------------------------------------------|
| Aesthetic       | Dark editorial — Bloomberg Terminal meets modern SaaS           |
| Display Font    | **Syne** (headings, labels) — geometric, strong personality     |
| Data Font       | **JetBrains Mono** (numbers, tags) — readable at small sizes    |
| Primary Accent  | Amber gold `#f5a623`                                            |
| Income Color    | Teal `#2dd4a7`                                                  |
| Expense Color   | Rose `#f25a6e`                                                  |
| Animation       | Staggered `fadeUp` on load; per-row `slideIn` in table          |
| Grid texture    | Subtle CSS grid-line background for depth                       |

---

## Tech Stack

| Tool        | Version  | Purpose                         |
|-------------|----------|---------------------------------|
| React       | 18.x     | UI framework                    |
| Vite        | 5.x      | Build tool & dev server         |
| Tailwind CSS| 3.x      | Utility-first styling           |
| Recharts    | 2.x      | Charts (Bar, Area, Pie)         |

No TypeScript. Pure JavaScript throughout.

---

## Assumptions

- Data is **mock/static** (Q1 2024) — no backend or API
- No localStorage persistence (by design for simplicity)
- Role switching is UI-only, no authentication layer
- Currency is USD
