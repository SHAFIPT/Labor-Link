/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './public/**/*.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        custom: {
          light: '#000000', // black for light mode
          dark: '#D5FBF4'   // your custom color for dark mode
        }
      }
    },
  },
  plugins: [],
}