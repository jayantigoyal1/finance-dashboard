// ─────────────────────────────────────────────────────────────
//  formatters.js  — Shared formatting utilities
// ─────────────────────────────────────────────────────────────

/**
 * Format a number as INR currency using Indian numbering system.
 * @param {number} n
 * @returns {string}  e.g.  "₹2,400" / "₹1,20,000"
 */
export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(n))

/**
 * Format a date string to a short readable form.
 * @param {string} d  ISO date string
 * @returns {string}  e.g.  "Jan 5, '24"
 */
export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  '2-digit',
  })
