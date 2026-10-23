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
        background: '#090A0E',
        volt: {
          DEFAULT: '#D4F933',
          hover: '#E2F952',
          dark: '#A6C617',
          light: '#EEFF7A',
        },
        navy: {
          950: '#020B1B',
          900: '#031329',
          850: '#061B3B',
          800: '#0C2754',
          700: '#143875',
        },
        brand: {
          blue: '#078BFF',
          cyan: '#00D9FF',
          purple: '#693BFF',
        },
        surface: {
          DEFAULT: '#0E1015',
          subtle: '#14161C',
          muted: '#1E2129',
        },
        emergency: {
          red: '#EF4444',
          amber: '#F59E0B',
          cyan: '#00D9FF',
          green: '#10B981',
          purple: '#693BFF',
        }
      },
      fontFamily: {
        heading: ['Anton', 'Impact', 'Bebas Neue', 'sans-serif'],
        body: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -3px rgba(7, 139, 255, 0.4)',
        'glow-cyan': '0 0 25px -3px rgba(0, 217, 255, 0.4)',
        'glow-purple': '0 0 25px -3px rgba(105, 59, 255, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
