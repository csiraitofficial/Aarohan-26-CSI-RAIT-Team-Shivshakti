/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/components/admin/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#002868',
                secondary: '#00AEEF',
                accent: '#FF6B35',
                background: '#F5F7FB',
            }
        },
    },
    plugins: [],
}
