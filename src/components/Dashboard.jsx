// ─────────────────────────────────────────────────────────────
//  Dashboard.jsx  — Main overview / landing page
//  Sections: stat cards, cash-flow chart, pie chart, recent txs
// ─────────────────────────────────────────────────────────────

import React, { useMemo, useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { useFinanceInsights } from '../hooks/useFinanceInsights'
import { CATEGORY_COLORS } from '../data/mockData'
import { formatCurrency, formatDate } from '../utils/formatters'
import Card from './Card'

// ── Shared Recharts Tooltip ─────────────────────────────────
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

// ── Cash Flow Bar Chart ─────────────────────────────────────
function CashFlowChart({ data }) {
  const legend = [
    { key: 'Income',   color: '#2dd4a7' },
    { key: 'Expenses', color: '#f25a6e' },
    { key: 'Net',      color: '#f5a623' },
  ]
  return (
    <div className="animate-fade-up col-span-2 rounded-xl border border-border bg-surface p-6 opacity-0-init"
      style={{ animationDelay: '0.12s' }}>
      <div className="mb-1 flex items-start justify-between">
        <div>
          <div className="font-display text-[14px] font-bold tracking-[-0.01em] text-text1">
            MONTHLY CASH FLOW
          </div>
          <div className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-text2">
            INCOME VS EXPENSES — Q1 2024
          </div>
        </div>
        <div className="flex gap-4">
          {legend.map(({ key, color }) => (
            <div key={key} className="flex items-center gap-1.5 font-mono text-[10px] text-text2">
              <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
              {key}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid stroke="#1f2530" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false}
              tick={{ fill: '#8b95a3', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fill: '#8b95a3', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="Income"   fill="#2dd4a7" radius={[4,4,0,0]} maxBarSize={40} />
            <Bar dataKey="Expenses" fill="#f25a6e" radius={[4,4,0,0]} maxBarSize={40} />
            <Bar dataKey="Net"      fill="#f5a623" radius={[4,4,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── Spending Donut Chart ────────────────────────────────────
function SpendingDonut({ data }) {
  const [activeIdx, setActiveIdx] = useState(null)

  return (
    <div className="animate-fade-up rounded-xl border border-border bg-surface p-6 opacity-0-init"
      style={{ animationDelay: '0.18s' }}>
      <div className="mb-1 font-display text-[14px] font-bold tracking-[-0.01em] text-text1">
        SPENDING BREAKDOWN
      </div>
      <div className="mb-2 font-mono text-[10px] tracking-[0.08em] text-text2">
        BY CATEGORY — ALL TIME
      </div>

      <ResponsiveContainer width="100%" height={155}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={66}
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

      <div className="mt-3 flex flex-col gap-1.5">
        {data.slice(0, 5).map((d, i) => (
          <div key={d.name}
            className="flex cursor-default items-center justify-between transition-opacity"
            style={{ opacity: activeIdx === null || activeIdx === i ? 1 : 0.4 }}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />
              <span className="font-mono text-[11px] text-text2">{d.name}</span>
            </div>
            <span className="font-mono text-[11px] font-medium text-text1">
              {formatCurrency(d.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Recent Transactions Feed ────────────────────────────────
function RecentActivity({ transactions }) {
  const recent = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
    [transactions]
  )

  return (
    <div className="animate-fade-up rounded-xl border border-border bg-surface p-6 opacity-0-init"
      style={{ animationDelay: '0.22s' }}>
      <div className="mb-1 font-display text-[14px] font-bold tracking-[-0.01em] text-text1">
        RECENT ACTIVITY
      </div>
      <div className="mb-5 font-mono text-[10px] tracking-[0.08em] text-text2">
        LATEST TRANSACTIONS
      </div>

      <div className="flex flex-col gap-2.5">
        {recent.map((tx) => (
          <div key={tx.id}
            className="flex items-center justify-between rounded-lg border border-border
              bg-surface2 px-3.5 py-2.5 transition-colors hover:border-border2"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm
                ${tx.type === 'income' ? 'bg-green/10 text-green' : 'bg-red/10 text-red'}`}>
                {tx.type === 'income' ? '↑' : '↓'}
              </div>
              <div>
                <div className="font-mono text-[12px] font-medium text-text1">{tx.desc}</div>
                <div className="mt-0.5 font-mono text-[10px] text-text3">
                  {tx.category} · {formatDate(tx.date)}
                </div>
              </div>
            </div>
            <span className={`font-mono text-[13px] font-semibold tracking-tight
              ${tx.type === 'income' ? 'text-green' : 'text-red'}`}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Dashboard View ─────────────────────────────────────
export default function Dashboard() {
  const { transactions, stats } = useApp()
  const { categoryBreakdown, monthlyData } = useFinanceInsights(transactions)

  const summaryCards = [
    {
      label: 'NET BALANCE',
      value: formatCurrency(stats.balance),
      sub:   `Savings rate: ${stats.savingsRate.toFixed(1)}%`,
      accentColor: '#f5a623',
      icon:  '◈',
      animDelay: 0.04,
    },
    {
      label: 'TOTAL INCOME',
      value: formatCurrency(stats.income),
      sub:   '3 months · Q1 2024',
      accentColor: '#2dd4a7',
      icon:  '↑',
      animDelay: 0.08,
    },
    {
      label: 'TOTAL EXPENSES',
      value: formatCurrency(stats.expenses),
      sub:   'Across all categories',
      accentColor: '#f25a6e',
      icon:  '↓',
      animDelay: 0.12,
    },
    {
      label: 'TRANSACTIONS',
      value: transactions.length,
      sub:   'All time entries',
      accentColor: '#5b8def',
      icon:  '≡',
      animDelay: 0.16,
    },
  ]

  return (
    <div className="mx-auto max-w-[1400px] p-6">
      {/* Page Header */}
      <div className="mb-6 animate-fade-up opacity-0-init">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.03em] text-text1">
          Financial Overview
        </h1>
        <p className="mt-1.5 font-mono text-[11px] tracking-[0.05em] text-text2">
          Q1 2024 — UPDATED JUST NOW
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row: Cash flow (2/3) + Donut (1/3) */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <CashFlowChart data={monthlyData} />
        <SpendingDonut data={categoryBreakdown} />
      </div>

      {/* Recent Activity */}
      <RecentActivity transactions={transactions} />
    </div>
  )
}
