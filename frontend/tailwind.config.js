/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#020617',
          primary: '#3b82f6',
          glow: '#60a5fa',
          cyan: '#22d3ee',
          panel: 'rgba(15, 23, 42, 0.75)',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 130, 246, 0.4)',
        cyan: '0 0 15px rgba(34, 211, 238, 0.35)',
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
