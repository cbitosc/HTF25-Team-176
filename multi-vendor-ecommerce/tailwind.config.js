/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'halloween-purple': '#2E003E',
        'halloween-orange': '#E85D04',
        'halloween-beige': '#FFF5E1',
        'halloween-green': '#386641',
        'halloween-yellow': '#FFD60A',
      },
      fontFamily: {
        'lobster': ['"Lobster Two"', 'cursive'],
        'gloria': ['"Gloria Hallelujah"', 'cursive'],
      },
    },
  },
  plugins: [],
}