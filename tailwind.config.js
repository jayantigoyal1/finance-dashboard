/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg:       '#0b0d10',
        surface:  '#12151a',
        surface2: '#181c23',
        border:   '#1f2530',
        border2:  '#2a3040',
        gold:     '#f5a623',
        'gold-dim': '#c47f0f',
        green:    '#2dd4a7',
        red:      '#f25a6e',
        blue:     '#5b8def',
        purple:   '#9b72ef',
        text1:    '#e8ecf0',
        text2:    '#8b95a3',
        text3:    '#3d4756',
      },
      animation: {
        'fade-up':   'fadeUp 0.45s ease forwards',
        'slide-in':  'slideIn 0.35s ease forwards',
        'ticker':    'ticker 32s linear infinite',
        'pulse-gold':'pulseGold 3s ease infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn:   { from: { opacity: 0, transform: 'translateX(-10px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        ticker:    { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(245,166,35,0.35)' }, '50%': { boxShadow: '0 0 0 7px rgba(245,166,35,0)' } },
      },
    },
  },
  plugins: [],
}
