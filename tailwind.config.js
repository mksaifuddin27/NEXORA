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
        navy: {
          950: '#060B14',
          900: '#0A0F1D',
          850: '#0D1527',
          800: '#111C35',
          750: '#162342',
          700: '#1C2B50',
          600: '#273B6B',
        },
        card: {
          dark: '#0E1729',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.12)',
        },
        brand: {
          primary: '#6366F1',   // Indigo
          primaryHover: '#4F46E5',
          secondary: '#38BDF8', // Cyan/Sky
          accent: '#818CF8',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-grid': 'radial-gradient(rgba(99, 102, 241, 0.12) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
