/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#090B10',
          darker: '#05070A',
          subtle: '#0F131C',
        },
        surface: {
          DEFAULT: '#141923',
          elevated: '#1C2333',
          card: '#181E2B',
          glass: 'rgba(24, 30, 43, 0.75)',
        },
        border: {
          DEFAULT: '#252D3E',
          muted: '#1B2230',
          accent: '#00F050',
        },
        lime: {
          accent: 'var(--color-accent, #A855F7)',
          glow: 'var(--color-glow, rgba(168, 85, 247, 0.35))',
          muted: 'var(--color-secondary-accent, #C4B5FD)',
        },
        neon: {
          orange: '#FF5E1E',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          purple: '#A855F7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        display: ['Cabinet Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(0, 240, 80, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(255, 94, 30, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'timer-tick': 'tick 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
