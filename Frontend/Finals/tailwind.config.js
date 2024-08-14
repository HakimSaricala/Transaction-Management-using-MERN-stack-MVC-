/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#59A60E',
        'hover-green': '#BE216',
        'custom-bg':  '#FBF6EE',
      },
    },
  },
  plugins: [require("daisyui")],
}

