/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F3D73",
        secondary: "#1E6BD6",
        accent: "#FF6B35",
        bgMain: "#F5F7FB",
        background: "#F5F7FB",
      },
    },
  },
  plugins: [],
}
