// ─────────────────────────────────────────────────────────────
//  useFinanceInsights.js  — Derived insight calculations
//  Separates analytics logic from UI components
// ─────────────────────────────────────────────────────────────

import { useMemo } from 'react'
import { CATEGORY_COLORS } from '../data/mockData'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function useFinanceInsights(transactions) {

  // ── Spending by category (expenses only) ──────────────────
  const categoryBreakdown = useMemo(() => {
    const map = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Math.abs(t.amount)
      })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#8b95a3' }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  // ── Monthly aggregates (income, expenses, net) ─────────────
  const monthlyData = useMemo(() => {
    const map = {}
    transactions.forEach((t) => {
      const m = new Date(t.date).getMonth()
      if (!map[m]) map[m] = { income: 0, expenses: 0 }
      if (t.type === 'income') map[m].income += t.amount
      else map[m].expenses += Math.abs(t.amount)
    })
    return Object.entries(map).map(([m, d]) => ({
      month:    MONTH_NAMES[+m],
      Income:   d.income,
      Expenses: d.expenses,
      Net:      d.income - d.expenses,
    }))
  }, [transactions])

  // ── Top-level insight values ───────────────────────────────
  const topCategory    = categoryBreakdown[0] || null
  const totalIncome    = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses  = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0)
  const savingsRate    = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const expenseCount   = transactions.filter((t) => t.type === 'expense').length
  const avgExpense     = expenseCount > 0 ? totalExpenses / expenseCount : 0

  return {
    categoryBreakdown,
    monthlyData,
    topCategory,
    totalIncome,
    totalExpenses,
    savingsRate,
    avgExpense,
  }
}
