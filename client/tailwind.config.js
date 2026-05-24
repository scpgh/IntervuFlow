/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#090908',               // Gallery-black background
          bgLight: '#fbfaf7',          // Warm porcelain light background
          card: 'var(--color-bg-card)', // Dynamic glass card fill
          cardLight: 'rgba(255, 255, 255, 0.95)', // Glass light card fallback
          border: 'var(--color-border)', // Dynamic border
          borderHover: 'var(--color-border-hover)', // Dynamic border hover
          borderLight: 'rgba(0, 0, 0, 0.06)',
          primary: '#d9b76f',          // Champagne gold
          primaryHover: '#c49d4b',     // Deeper gold
          secondary: '#8ee8cf',        // Soft mint highlight
          accent: '#a78bfa',           // Velvet violet accent
          danger: '#ef4444',           // Coral Red (Critical)
          textMain: 'var(--color-text-main)', // Dynamic text main
          textMainLight: '#15120d',    // Deep warm ink text
          textMuted: 'var(--color-text-muted)', // Dynamic text muted
          textMutedLight: '#615b50',   // Muted warm grey text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 22px rgba(217, 183, 111, 0.22)',
        'glow-secondary': '0 0 22px rgba(142, 232, 207, 0.16)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(217, 183, 111, 0.16)' },
          '50%': { boxShadow: '0 0 24px rgba(217, 183, 111, 0.34)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
