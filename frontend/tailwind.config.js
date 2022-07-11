/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({ addVariant, e }) {
      addVariant('third-child', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`third-child${separator}${className}`)}:nth-child(3n)`
        })
      })
    })
  ],
}
