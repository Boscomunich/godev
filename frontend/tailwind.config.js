/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./src/**/*.{jsx,js,ts,tsx}"],
  theme: {
    screens: {
      'sm': {'max': '520px'},
      'md': {'min': '521px','max': '820px'},
      'lg': {'max': '1536px', 'min':'821px'}
    },
    extend: {
      colors: {
        primary: "#040915",
        secondary: "#061F58",
        rare: '#FAFAFA',
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      fontFamily: {
        inter: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
