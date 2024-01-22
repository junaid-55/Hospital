/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom color classes here
        primary: '#ff0000',
        secondary: '#00ff00',
        // Add more color classes as needed
      },
      fontFamily: {
        // Add your custom font classes here
        custom: ['CustomFont', 'sans-serif'],
        // Add more font classes as needed
      },
      // Add more theme modifications as needed
    },
  },
  plugins: [],
}
