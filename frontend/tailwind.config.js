/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#020617', // slate-950
        surface: '#0f172a',    // slate-900
        surfaceHighlight: '#1e293b', // slate-800
        primary: {
          400: '#a78bfa',
          500: '#8b5cf6', // violet-500
          600: '#7c3aed',
        },
        accent: {
          400: '#34d399',
          500: '#10b981', // emerald-500
          600: '#059669',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
