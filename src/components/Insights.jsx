// ─────────────────────────────────────────────────────────────
//  Insights.jsx  — Financial analytics & pattern view
//  Charts: Monthly Net Area, Category Ranking bars
//  Insight cards: top category, savings rate, avg expense, net
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { useFinanceInsights } from '../hooks/useFinanceInsights'
import { CATEGORY_COLORS } from '../data/mockData'
import { formatCurrency } from '../utils/formatters'
import Card from './Card'

// ── Shared Tooltip ─────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border2 bg-surface2 px-3.5 py-2.5 font-mono text-[11px]">
      <div className="mb-1.5 tracking-[0.08em] text-text2">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }} className="mb-0.5">
          {p.dataKey}: <strong>{formatCurrency(p.value)}</strong>
        </div>
      ))}
    </div>
  )
}

// ── Monthly Net Area Chart ──────────────────────────────────
function MonthlyNetChart({ data }) {
  return (
    <div className="animate-fade-up rounded-xl border border-border bg-surface p-6 opacity-0-init"
      style={{ animationDelay: '0.15s' }}>
      <div className="mb-1 font-display text-[14px] font-bold tracking-[-0.01em] text-text1">
        MONTHLY NET INCOME
      </div>
      <div className="mb-5 font-mono text-[10px] tracking-[0.08em] text-text2">
        INCOME MINUS EXPENSES PER MONTH
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f5a623" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1f2530" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false}
            tick={{ fill: '#8b95a3', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis axisLine={false} tickLine={false}
            tick={{ fill: '#8b95a3', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="Net" stroke="#f5a623" fill="url(#netGrad)"
            strokeWidth={2} dot={{ fill: '#f5a623', strokeWidth: 0, r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Monthly Grouped Bar Chart ───────────────────────────────
function MonthlyComparisonChart({ data }) {
  return (
    <div className="animate-fade-up rounded-xl border border-border bg-surface p-6 opacity-0-init"
      style={{ animationDelay: '0.2s' }}>
      <div className="mb-1 font-display text-[14px] font-bold tracking-[-0.01em] text-text1">
        INCOME VS EXPENSES
      </div>
      <div className="mb-5 font-mono text-[10px] tracking-[0.08em] text-text2">
        MONTHLY COMPARISON — Q1 2024
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid stroke="#1f2530" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false}
            tick={{ fill: '#8b95a3', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
          <YAxis axisLine={false} tickLine={false}
            tick={{ fill: '#8b95a3', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="Income"   fill="#2dd4a7" radius={[4,4,0,0]} maxBarSize={36} />
          <Bar dataKey="Expenses" fill="#f25a6e" radius={[4,4,0,0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Category Donut + Ranked List ────────────────────────────
function CategoryBreakdown({ data }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const maxVal = data[0]?.value || 1

  return (
    <div className="animate-fade-up rounded-xl border border-border bg-surface p-6 opacity-0-init"
      style={{ animationDelay: '0.25s' }}>
      <div className="mb-1 font-display text-[14px] font-bold tracking-[-0.01em] text-text1">
        CATEGORY RANKING
      </div>
      <div className="mb-5 font-mono text-[10px] tracking-[0.08em] text-text2">
        ALL-TIME EXPENSE BREAKDOWN
      </div>

      {/* Donut */}
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={44} outerRadius={68}
            paddingAngle={3} dataKey="value"
            onMouseEnter={(_, i) => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color}
                opacity={activeIdx === null || activeIdx === i ? 1 : 0.3}
                stroke="#12151a" strokeWidth={2} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Ranked bars */}
      <div className="mt-4 flex flex-col gap-3">
        {data.slice(0, 6).map((cat, i) => (
          <div key={cat.name}
            className="animate-slide-in opacity-0-init"
            style={{ animationDelay: `${0.3 + i * 0.06}s` }}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-4 font-mono text-[10px] text-text3">#{i + 1}</span>
                <span className={`font-mono text-[12px] transition-colors
                  ${activeIdx === i ? 'text-text1' : 'text-text2'}`}>
                  {cat.name}
                </span>
              </div>
              <span className="font-mono text-[12px] font-semibold text-text1">
                {formatCurrency(cat.value)}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(cat.value / maxVal) * 100}%`,
                  background: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Insights View ──────────────────────────────────────
export default function Insights() {
  const { transactions } = useApp()
  const {
    categoryBreakdown, monthlyData,
    topCategory, totalIncome, totalExpenses,
    savingsRate, avgExpense,
  } = useFinanceInsights(transactions)

  const insightCards = [
    {
      label:        'TOP SPENDING CATEGORY',
      value:        topCategory?.name || '—',
      sub:          topCategory ? `${formatCurrency(topCategory.value)} spent · highest of all categories` : 'No data',
      accentColor:  CATEGORY_COLORS[topCategory?.name] || '#f5a623',
      icon:         '⬡',
      animDelay:    0.05,
    },
    {
      label:        'SAVINGS RATE',
      value:        `${savingsRate.toFixed(1)}%`,
      sub:          savingsRate > 20 ? '✓ Above 20% target — well managed' : '⚠ Below 20% target — room to improve',
      accentColor:  savingsRate > 20 ? '#2dd4a7' : '#f5a623',
      icon:         '◈',
      animDelay:    0.10,
    },
    {
      label:        'AVG EXPENSE SIZE',
      value:        formatCurrency(avgExpense),
      sub:          'Mean value across all expense transactions',
      accentColor:  '#5b8def',
      icon:         '∅',
      animDelay:    0.15,
    },
    {
      label:        'NET POSITION',
      value:        formatCurrency(totalIncome - totalExpenses),
      sub:          `Income ${formatCurrency(totalIncome)} · Expenses ${formatCurrency(totalExpenses)}`,
      accentColor:  '#9b72ef',
      icon:         '≋',
      animDelay:    0.20,
    },
  ]

  return (
    <div className="mx-auto max-w-[1400px] p-6">
      {/* Page Header */}
      <div className="mb-6 animate-fade-up opacity-0-init">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.03em] text-text1">
          Insights
        </h1>
        <p className="mt-1.5 font-mono text-[11px] tracking-[0.05em] text-text2">
          PATTERNS & OBSERVATIONS FROM YOUR FINANCIAL DATA
        </p>
      </div>

      {/* Insight Cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {insightCards.map((card) => (
          <Card key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MonthlyNetChart data={monthlyData} />
        <MonthlyComparisonChart data={monthlyData} />
      </div>

      {/* Category Breakdown */}
      <CategoryBreakdown data={categoryBreakdown} />
    </div>
  )
}
