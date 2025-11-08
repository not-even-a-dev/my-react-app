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
        // Pastel color palette for playful theme
        'pastel-blue': '#A8D8EA',
        'pastel-pink': '#FFB6C1',
        'pastel-purple': '#E6E6FA',
        'pastel-green': '#B4E5D3',
        'pastel-yellow': '#FFF9C4',
        'pastel-orange': '#FFD4A3',
        // Darker variants for better contrast with white text
        'pastel-blue-dark': '#6BB6D8',
        'pastel-purple-dark': '#B8B8E0',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}

