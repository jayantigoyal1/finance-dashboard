// ─────────────────────────────────────────────────────────────
//  Header.jsx  — App header: logo, nav tabs, role switcher
//  Also renders the live market ticker strip above the nav
// ─────────────────────────────────────────────────────────────

import React from 'react'
import { useApp } from '../context/AppContext'
import { TICKER_ITEMS } from '../data/mockData'

const NAV_TABS = [
  { id: 'dashboard',    label: 'Overview'      },
  { id: 'transactions', label: 'Transactions'  },
  { id: 'insights',     label: 'Insights'      },
]

// ── Ticker Strip ─────────────────────────────────────────────
function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="overflow-hidden border-b border-border bg-surface" style={{ height: 30 }}>
      <div className="flex h-full items-center animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mr-12 font-mono text-[10px] tracking-[0.05em] text-text2"
          >
            <span className={item.includes('↑') ? 'text-green' : 'text-red'}>●</span>{' '}
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main Header ───────────────────────────────────────────────
export default function Header() {
  const { role, setRole, activeTab, setActiveTab } = useApp()

  return (
    <header className="sticky top-0 z-50">
      <Ticker />

      <div className="flex h-[58px] items-center justify-between border-b border-border bg-surface px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gold">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5L5 9.5L11 3" stroke="#0b0d10" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display text-lg font-bold tracking-[-0.025em] text-text1">
              LEDGER
            </span>
          </div>

          {/* Nav Tabs */}
          <nav className="flex gap-1">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-md px-3.5 py-1.5 font-mono text-[11px] font-medium
                    tracking-[0.08em] transition-all duration-200
                    ${isActive
                      ? 'border border-gold/30 bg-gold/10 text-gold'
                      : 'border border-transparent text-text2 hover:text-text1'
                    }`}
                >
                  {tab.label.toUpperCase()}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Role Switcher + Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface2 px-3 py-1.5">
            <span className="font-mono text-[10px] tracking-[0.1em] text-text2">ROLE</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`bg-transparent font-mono text-[11px] font-semibold
                tracking-[0.05em] outline-none cursor-pointer border-none
                ${role === 'admin' ? 'text-gold' : 'text-blue'}`}
            >
              <option value="admin">ADMIN</option>
              <option value="viewer">VIEWER</option>
            </select>
          </div>

          <div
            className="flex h-8 w-8 items-center justify-center rounded-full
              bg-gradient-to-br from-gold to-gold-dim font-mono text-[12px]
              font-bold text-bg animate-pulse-gold"
          >
            {role === 'admin' ? 'A' : 'V'}
          </div>
        </div>
      </div>

      {/* Viewer banner */}
      {role === 'viewer' && (
        <div className="flex items-center gap-2 border-b border-blue/20 bg-blue/5 px-6 py-2
          font-mono text-[11px] tracking-[0.07em] text-blue">
          <span>●</span>
          VIEWER MODE — READ ONLY. Switch to Admin to add or remove transactions.
        </div>
      )}
    </header>
  )
}
