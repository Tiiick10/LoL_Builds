/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
      "./providers/**/*.{js,jsx,ts,tsx}",
      "./utils/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
  }
  