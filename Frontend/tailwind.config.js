/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // slate-900
        surface: "#1e293b", // slate-800
        surfaceHover: "#334155", // slate-700
        primary: "#3b82f6", // blue-500
        primaryHover: "#2563eb", // blue-600
        danger: "#ef4444", // red-500
        success: "#10b981", // emerald-500
        warning: "#f59e0b", // amber-500
        textMain: "#f8fafc", // slate-50
        textMuted: "#94a3b8", // slate-400
        border: "#334155", // slate-700
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
