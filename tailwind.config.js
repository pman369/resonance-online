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
          bg: '#05050a',
          surface: '#0d0d1a',
          gold: '#00E5FF', // Map legacy gold references to brand Cyan
          cream: '#EDEBF5', // Brighter, cool-toned cream
          muted: '#7C7A94', // Cool indigo-muted gray
          border: '#1b1a30', // Indigo border
          danger: '#FF4081', // Hot pink for warnings/danger
          cyan: '#00E5FF',
          cobalt: '#2962FF',
          deeppurple: '#6200EA',
          violet: '#AA00FF',
          magenta: '#D500F9',
          hotpink: '#FF4081',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
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
