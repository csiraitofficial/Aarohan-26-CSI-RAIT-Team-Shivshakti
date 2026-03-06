/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#002868",
        secondary: "#00AEEF",
        accent: "#FF6B35",
        bgMain: "#F5F7FB",
        background: "#F5F7FB",
      },
    },
  },
  plugins: [],
}
