// ─────────────────────────────────────────────────────────────
//  App.jsx  — Root component
//  Wraps the app in AppProvider and renders the active view
// ─────────────────────────────────────────────────────────────

import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import TransactionsTable from './components/TransactionsTable'
import Insights from './components/Insights'
import Footer from './components/Footer'

// ── Inner App (needs context access) ─────────────────────────
function AppInner() {
  const { activeTab } = useApp()

  return (
    <div className="grid-bg min-h-screen bg-bg">
      <Header />

      <main className="min-h-[calc(100vh-88px)]">
        {activeTab === 'dashboard'    && <Dashboard />}
        {activeTab === 'transactions' && <TransactionsTable />}
        {activeTab === 'insights'     && <Insights />}
      </main>
      <Footer />
    </div>
  )
}

// ── Root Export ───────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
