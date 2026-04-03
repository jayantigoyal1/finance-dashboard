// ─────────────────────────────────────────────────────────────
//  mockData.js  — Static seed data for the Ledger dashboard
// ─────────────────────────────────────────────────────────────

export const CATEGORIES = [
  'Housing', 'Food', 'Transport', 'Entertainment',
  'Health', 'Shopping', 'Salary', 'Freelance', 'Investment', 'Utilities',
]

export const CATEGORY_COLORS = {
  Housing:       '#5b8def',
  Food:          '#f5a623',
  Transport:     '#2dd4a7',
  Entertainment: '#9b72ef',
  Health:        '#f25a6e',
  Shopping:      '#f59342',
  Salary:        '#2dd4a7',
  Freelance:     '#5b8def',
  Investment:    '#d4b72d',
  Utilities:     '#8b95a3',
}

export const TICKER_ITEMS = [
  'SENSEX 73,954 ↑0.8%',
  'NIFTY50 22,406 ↑0.6%',
  'BTC ₹56,12,400 ↑2.3%',
  'RELIANCE ₹2,934 ↑1.1%',
  'TCS ₹3,812 ↓0.4%',
  'INFY ₹1,478 ↑0.9%',
  'Gold ₹71,340/10g ↑0.5%',
  'USD/INR 83.42 ↓0.1%',
]

export const INITIAL_TRANSACTIONS = [
  { id: 1,  date: '2024-01-03', desc: 'Monthly Rent',         category: 'Housing',       amount: -18000, type: 'expense' },
  { id: 2,  date: '2024-01-05', desc: 'Salary Deposit',       category: 'Salary',        amount: 85000,  type: 'income'  },
  { id: 3,  date: '2024-01-07', desc: 'Grocery Run',          category: 'Food',          amount: -3200,  type: 'expense' },
  { id: 4,  date: '2024-01-09', desc: 'Netflix + Spotify',    category: 'Entertainment', amount: -1100,  type: 'expense' },
  { id: 5,  date: '2024-01-11', desc: 'Ola / Uber Rides',     category: 'Transport',     amount: -1800,  type: 'expense' },
  { id: 6,  date: '2024-01-13', desc: 'Freelance Project',    category: 'Freelance',     amount: 25000,  type: 'income'  },
  { id: 7,  date: '2024-01-15', desc: 'Pharmacy',             category: 'Health',        amount: -950,   type: 'expense' },
  { id: 8,  date: '2024-01-17', desc: 'Electricity Bill',     category: 'Utilities',     amount: -2200,  type: 'expense' },
  { id: 9,  date: '2024-01-19', desc: 'Flipkart Order',       category: 'Shopping',      amount: -4500,  type: 'expense' },
  { id: 10, date: '2024-01-22', desc: 'Nifty ETF Purchase',   category: 'Investment',    amount: -10000, type: 'expense' },
  { id: 11, date: '2024-01-25', desc: 'Restaurant Dinner',    category: 'Food',          amount: -1600,  type: 'expense' },
  { id: 12, date: '2024-01-28', desc: 'Petrol',               category: 'Transport',     amount: -2800,  type: 'expense' },
  { id: 13, date: '2024-02-01', desc: 'Monthly Rent',         category: 'Housing',       amount: -18000, type: 'expense' },
  { id: 14, date: '2024-02-05', desc: 'Salary Deposit',       category: 'Salary',        amount: 85000,  type: 'income'  },
  { id: 15, date: '2024-02-07', desc: 'Grocery Run',          category: 'Food',          amount: -3800,  type: 'expense' },
  { id: 16, date: '2024-02-10', desc: 'Concert Tickets',      category: 'Entertainment', amount: -3500,  type: 'expense' },
  { id: 17, date: '2024-02-12', desc: 'Freelance Project',    category: 'Freelance',     amount: 18000,  type: 'income'  },
  { id: 18, date: '2024-02-14', desc: 'Valentine Dinner',     category: 'Food',          amount: -2800,  type: 'expense' },
  { id: 19, date: '2024-02-16', desc: 'Gym Membership',       category: 'Health',        amount: -2000,  type: 'expense' },
  { id: 20, date: '2024-02-19', desc: 'Clothing — Myntra',    category: 'Shopping',      amount: -6500,  type: 'expense' },
  { id: 21, date: '2024-02-22', desc: 'Internet + DTH Bill',  category: 'Utilities',     amount: -1400,  type: 'expense' },
  { id: 22, date: '2024-02-25', desc: 'Nifty ETF Purchase',   category: 'Investment',    amount: -10000, type: 'expense' },
  { id: 23, date: '2024-02-27', desc: 'Auto / Taxi',          category: 'Transport',     amount: -900,   type: 'expense' },
  { id: 24, date: '2024-03-01', desc: 'Monthly Rent',         category: 'Housing',       amount: -18000, type: 'expense' },
  { id: 25, date: '2024-03-05', desc: 'Salary Deposit',       category: 'Salary',        amount: 85000,  type: 'income'  },
  { id: 26, date: '2024-03-08', desc: 'Grocery Run',          category: 'Food',          amount: -3500,  type: 'expense' },
  { id: 27, date: '2024-03-11', desc: 'Streaming Services',   category: 'Entertainment', amount: -1100,  type: 'expense' },
  { id: 28, date: '2024-03-13', desc: 'Freelance Project',    category: 'Freelance',     amount: 32000,  type: 'income'  },
  { id: 29, date: '2024-03-16', desc: 'Doctor Visit',         category: 'Health',        amount: -1500,  type: 'expense' },
  { id: 30, date: '2024-03-20', desc: 'New Sneakers',         category: 'Shopping',      amount: -4200,  type: 'expense' },
  { id: 31, date: '2024-03-22', desc: 'Water + Gas Bill',     category: 'Utilities',     amount: -1800,  type: 'expense' },
  { id: 32, date: '2024-03-25', desc: 'Nifty ETF Purchase',   category: 'Investment',    amount: -10000, type: 'expense' },
  { id: 33, date: '2024-03-28', desc: 'Petrol',               category: 'Transport',     amount: -2500,  type: 'expense' },
]
