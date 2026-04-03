// ─────────────────────────────────────────────────────────────
//  TransactionsTable.jsx
//  Features: search, filter, sort, add, edit, delete, reset
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES, CATEGORY_COLORS } from '../data/mockData'
import { formatCurrency, formatDate } from '../utils/formatters'

// ── Shared Add / Edit Modal ───────────────────────────────────
function TxModal({ existing, onClose }) {
  const { addTransaction, editTransaction } = useApp()
  const isEdit = !!existing

  const [form, setForm] = useState(
    isEdit
      ? {
          desc:     existing.desc,
          category: existing.category,
          amount:   Math.abs(existing.amount),
          type:     existing.type,
          date:     existing.date,
        }
      : {
          desc: '', category: 'Food', amount: '', type: 'expense',
          date: new Date().toISOString().split('T')[0],
        }
  )

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = () => {
    if (!form.desc.trim() || !form.amount) return
    const amount = form.type === 'income' ? +form.amount : -Math.abs(+form.amount)
    if (isEdit) {
      editTransaction({ ...existing, ...form, amount })
    } else {
      addTransaction({ ...form, amount, id: Date.now() })
    }
    onClose()
  }

  const inputClass = `w-full rounded-lg border border-border bg-surface2 px-4 py-2.5
    font-mono text-[13px] text-text1 outline-none transition-colors
    focus:border-gold placeholder:text-text3`

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-fade-up w-[440px] rounded-2xl border border-border2 bg-surface p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-text1">
            {isEdit ? 'EDIT TRANSACTION' : 'ADD TRANSACTION'}
          </h2>
          <button onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text3
              transition-colors hover:bg-surface2 hover:text-text1 font-mono text-base">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Description */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.12em] text-text2">
              DESCRIPTION
            </label>
            <input type="text" value={form.desc}
              onChange={(e) => set('desc', e.target.value)}
              placeholder="e.g. Grocery Run"
              className={inputClass} />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.12em] text-text2">
              AMOUNT (₹)
            </label>
            <input type="number" value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="0"
              className={inputClass} />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] tracking-[0.12em] text-text2">
              DATE
            </label>
            <input type="date" value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className={inputClass} />
          </div>

          {/* Type + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block font-mono text-[10px] tracking-[0.12em] text-text2">TYPE</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}
                className={inputClass}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[10px] tracking-[0.12em] text-text2">CATEGORY</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className={inputClass}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-surface2 py-3 font-mono
              text-[11px] tracking-[0.08em] text-text2 transition-colors hover:text-text1">
            CANCEL
          </button>
          <button onClick={handleSubmit}
            className="flex-1 rounded-lg bg-gold py-3 font-mono text-[11px] font-bold
              tracking-[0.08em] text-bg transition-opacity hover:opacity-90">
            {isEdit ? 'SAVE CHANGES' : 'ADD TRANSACTION'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sort Button ───────────────────────────────────────────────
function SortBtn({ field, label }) {
  const { sortBy, setSortBy, sortDir, setSortDir } = useApp()
  const isActive = sortBy === field
  const toggle = () => {
    if (isActive) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(field); setSortDir('desc') }
  }
  return (
    <button onClick={toggle}
      className={`flex items-center gap-1 font-mono text-[10px] tracking-[0.1em] transition-colors
        ${isActive ? 'text-gold' : 'text-text3 hover:text-text2'}`}>
      {label} {isActive && (sortDir === 'asc' ? '↑' : '↓')}
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────
export default function TransactionsTable() {
  const {
    filteredTransactions,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    search, setSearch,
    role, showAddModal, setShowAddModal,
    editingTx, setEditingTx,
    deleteTransaction, resetToSeedData,
  } = useApp()

  const [confirmDelete, setConfirmDelete] = useState(null)

  const typeFilters = [
    { value: 'all',     label: 'ALL'     },
    { value: 'income',  label: 'INCOME'  },
    { value: 'expense', label: 'EXPENSE' },
  ]

  const handleDelete = (id) => {
    deleteTransaction(id)
    setConfirmDelete(null)
  }

  return (
    <div className="mx-auto max-w-[1400px] p-6">

      {/* Page Header */}
      <div className="mb-6 flex animate-fade-up items-start justify-between opacity-0-init">
        <div>
          <h1 className="font-display text-[28px] font-extrabold tracking-[-0.03em] text-text1">
            Transactions
          </h1>
          <p className="mt-1.5 font-mono text-[11px] tracking-[0.05em] text-text2">
            {filteredTransactions.length} ENTRIES FOUND
          </p>
        </div>

        {role === 'admin' && (
          <div className="flex items-center gap-2">
            {/* Reset data */}
            <button onClick={resetToSeedData}
              className="rounded-lg border border-border bg-surface px-4 py-2.5 font-mono
                text-[11px] tracking-[0.08em] text-text3 transition-all
                hover:border-red/40 hover:text-red"
              title="Reset to default data">
              ↺ RESET
            </button>
            {/* Add */}
            <button onClick={() => setShowAddModal(true)}
              className="rounded-lg bg-gold px-5 py-2.5 font-mono text-[11px] font-bold
                tracking-[0.1em] text-bg transition-opacity hover:opacity-88">
              + ADD
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="mb-5 flex animate-fade-up flex-wrap gap-3 opacity-0-init"
        style={{ animationDelay: '0.07s' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search description or category..."
          className="min-w-[220px] flex-1 rounded-lg border border-border bg-surface px-4 py-2.5
            font-mono text-[12px] text-text1 outline-none transition-colors
            focus:border-gold placeholder:text-text3"
        />
        {typeFilters.map(({ value, label }) => (
          <button key={value} onClick={() => setFilterType(value)}
            className={`rounded-lg border px-4 py-2.5 font-mono text-[11px] font-medium
              tracking-[0.1em] transition-all duration-200
              ${filterType === value
                ? 'border-gold/35 bg-gold/10 text-gold'
                : 'border-border bg-surface text-text2 hover:text-text1'}`}>
            {label}
          </button>
        ))}
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5
            font-mono text-[11px] tracking-[0.05em] text-text2 outline-none cursor-pointer">
          <option value="all">ALL CATEGORIES</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="animate-fade-up overflow-hidden rounded-xl border border-border bg-surface opacity-0-init"
        style={{ animationDelay: '0.14s' }}>

        {/* Head */}
        <div className="grid border-b border-border bg-surface2 px-5 py-3"
          style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 72px' }}>
          <SortBtn field="date"   label="DATE"   />
          <span className="font-mono text-[10px] tracking-[0.1em] text-text3">DESCRIPTION</span>
          <span className="font-mono text-[10px] tracking-[0.1em] text-text3">CATEGORY</span>
          <span className="font-mono text-[10px] tracking-[0.1em] text-text3">TYPE</span>
          <SortBtn field="amount" label="AMOUNT" />
          <span />
        </div>

        {/* Rows */}
        {filteredTransactions.length === 0 ? (
          <div className="px-5 py-16 text-center font-mono text-[12px] tracking-[0.08em] text-text3">
            NO TRANSACTIONS MATCH YOUR FILTERS
          </div>
        ) : (
          filteredTransactions.map((tx, i) => (
            <div key={tx.id}
              className="grid animate-slide-in items-center border-b border-border px-5 py-3.5
                opacity-0-init transition-colors duration-150 last:border-0 hover:bg-surface2"
              style={{
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 72px',
                animationDelay: `${i * 0.025}s`,
              }}>

              <span className="font-mono text-[11px] text-text2">{formatDate(tx.date)}</span>
              <span className="font-mono text-[12px] font-medium text-text1">{tx.desc}</span>

              {/* Category pill */}
              <div>
                <span className="rounded px-2 py-1 font-mono text-[10px] font-medium tracking-[0.06em]"
                  style={{
                    background: `${CATEGORY_COLORS[tx.category] || '#8b95a3'}22`,
                    color: CATEGORY_COLORS[tx.category] || '#8b95a3',
                  }}>
                  {tx.category}
                </span>
              </div>

              {/* Type pill */}
              <div>
                <span className={`rounded px-2 py-1 font-mono text-[10px] font-medium tracking-[0.06em]
                  ${tx.type === 'income' ? 'bg-green/10 text-green' : 'bg-red/10 text-red'}`}>
                  {tx.type.toUpperCase()}
                </span>
              </div>

              {/* Amount */}
              <span className={`font-mono text-[13px] font-semibold tracking-tight
                ${tx.type === 'income' ? 'text-green' : 'text-red'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>

              {/* Actions — admin only */}
              {role === 'admin' ? (
                <div className="flex items-center gap-1 justify-end">
                  {/* Edit */}
                  <button onClick={() => setEditingTx(tx)}
                    className="flex h-7 w-7 items-center justify-center rounded font-mono text-[12px]
                      text-text3 transition-all hover:bg-gold/10 hover:text-gold"
                    title="Edit transaction">
                    ✎
                  </button>

                  {/* Delete with confirm */}
                  {confirmDelete === tx.id ? (
                    <button onClick={() => handleDelete(tx.id)}
                      className="flex h-7 w-7 items-center justify-center rounded bg-red/10
                        font-mono text-[11px] text-red transition-all hover:bg-red/20"
                      title="Confirm delete">
                      ✓
                    </button>
                  ) : (
                    <button onClick={() => setConfirmDelete(tx.id)}
                      className="flex h-7 w-7 items-center justify-center rounded font-mono
                        text-[13px] text-text3 transition-all hover:bg-red/10 hover:text-red"
                      title="Delete transaction">
                      ✕
                    </button>
                  )}
                </div>
              ) : (
                <span />
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <TxModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Modal */}
      {editingTx && (
        <TxModal existing={editingTx} onClose={() => setEditingTx(null)} />
      )}
    </div>
  )
}
