/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js}"],
  darkMode: 'class', // This is correct for class-based dark mode
  theme: {
    extend: {
      // You can extend the theme here if needed
      backgroundColor: {
        dark: '#111827', // Your dark mode background color
      },
      textColor: {
        dark: '#ffffff', // Your dark mode text color
      }
    }
  },
  plugins: [],
}