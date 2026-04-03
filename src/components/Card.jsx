// ─────────────────────────────────────────────────────────────
//  Card.jsx  — Reusable stat summary card
//  Props: label, value, sub, accentColor, icon, animDelay
// ─────────────────────────────────────────────────────────────

import React from 'react'

export default function Card({ label, value, sub, accentColor = '#f5a623', icon, animDelay = 0 }) {
  return (
    <div
      className="opacity-0-init animate-fade-up relative overflow-hidden rounded-xl
                 border border-border bg-surface px-6 py-5
                 transition-colors duration-200 hover:border-border2"
      style={{ animationDelay: `${animDelay}s` }}
    >
      {/* Top accent bar */}
      <div
        className="absolute left-0 top-0 h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      {/* Header row */}
      <div className="mb-3 flex items-start justify-between">
        <span className="text-[10px] font-medium tracking-[0.12em] text-text2">{label}</span>
        {icon && <span className="text-xl leading-none">{icon}</span>}
      </div>

      {/* Main value */}
      <div
        className="font-mono text-2xl font-semibold leading-none tracking-tight text-text1"
        style={{ letterSpacing: '-0.02em' }}
      >
        {value}
      </div>

      {/* Subtitle */}
      {sub && (
        <div className="mt-2 text-[11px] text-text2">{sub}</div>
      )}
    </div>
  )
}
