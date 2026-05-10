/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        resonance: {
          bg: '#0f0f0f',
          surface: '#161410',
          gold: '#C9A96E',
          cream: '#EDE8DF',
          muted: '#7D7568',
          border: '#2A2620',
          danger: '#8B3A3A',
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Lora', 'serif'],
        ui: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
