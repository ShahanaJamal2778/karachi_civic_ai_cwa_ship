/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          green: "#006600",
          dark: "#01411C",
          light: "#E8F5E9",
          bg: "#F7F8F7",
          border: "#E5E7EB",
          text: "#1F2937",
          muted: "#6B7280"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'Noto Sans Arabic', 'serif']
      }
    },
  },
  plugins: [],
}
