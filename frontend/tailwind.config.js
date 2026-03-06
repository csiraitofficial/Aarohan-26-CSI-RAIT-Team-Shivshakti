/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#002868",    // Deep Blue from your system
        secondary: "#00AEEF",  // Bright Blue from your system
        accent: "#FF6B35",     // Orange from your system
        bgMain: "#F5F7FB",     // Soft Background from your system
      },
    },
  },
  plugins: [],
}