// ─────────────────────────────────────────────────────────────
//  AppContext.jsx  — Global state via React Context
//  Manages: transactions, role, filters, navigation
//  Persistence: localStorage (key: "ledger_transactions")
// ─────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/mockData'

const AppContext = createContext(null)

const STORAGE_KEY = 'ledger_transactions'

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('Could not load from localStorage:', e)
  }
  return INITIAL_TRANSACTIONS
}

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(loadTransactions)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch (e) {
      console.warn('Could not save to localStorage:', e)
    }
  }, [transactions])

  const [role, setRole]                   = useState('admin')
  const [activeTab, setActiveTab]         = useState('dashboard')
  const [showAddModal, setShowAddModal]   = useState(false)
  const [editingTx, setEditingTx]         = useState(null)
  const [filterType, setFilterType]       = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [search, setSearch]               = useState('')
  const [sortBy, setSortBy]               = useState('date')
  const [sortDir, setSortDir]             = useState('desc')

  const addTransaction = (tx) => {
    setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev])
  }

  const editTransaction = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
    )
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const resetToSeedData = () => {
    setTransactions(INITIAL_TRANSACTIONS)
    localStorage.removeItem(STORAGE_KEY)
  }

  const filteredTransactions = useMemo(() => {
    let arr = [...transactions]
    if (filterType !== 'all')
      arr = arr.filter((t) => t.type === filterType)
    if (filterCategory !== 'all')
      arr = arr.filter((t) => t.category === filterCategory)
    if (search.trim())
      arr = arr.filter(
        (t) =>
          t.desc.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase())
      )
    arr.sort((a, b) => {
      const va = sortBy === 'date' ? new Date(a.date) : Math.abs(a.amount)
      const vb = sortBy === 'date' ? new Date(b.date) : Math.abs(b.amount)
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : va < vb ? 1 : -1
    })
    return arr
  }, [transactions, filterType, filterCategory, search, sortBy, sortDir])

  const stats = useMemo(() => {
    const income   = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0)
    const balance  = income - expenses
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
    return { income, expenses, balance, savingsRate }
  }, [transactions])

  const value = {
    transactions, filteredTransactions, stats,
    role, setRole,
    activeTab, setActiveTab,
    showAddModal, setShowAddModal,
    editingTx, setEditingTx,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    search, setSearch,
    sortBy, setSortBy,
    sortDir, setSortDir,
    addTransaction, editTransaction, deleteTransaction, resetToSeedData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}
