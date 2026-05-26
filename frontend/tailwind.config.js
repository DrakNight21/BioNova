/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#f4f6f1',
          100: '#e5ebd9',
          200: '#cedbb7',
          300: '#b0c68d',
          400: '#90af66',
          500: '#729346',
          600: '#587334',
          700: '#43582a',
          800: '#384825',
          900: '#2f3c21',
        },
        warm: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a38a80',
          600: '#756058',
          700: '#52423d',
          800: '#3d312d',
          900: '#29201d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
