/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",  // Include all possible file extensions
    "./index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' }
        }
      },
      animation: {
        scroll: 'scroll 40s linear infinite'
      }
    }
  },
  plugins: [],
}