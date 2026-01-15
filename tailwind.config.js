/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bigc: {
          green: "#69BD45",
          red: "#EE3124",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We might need to import Inter, or just rely on system sans for now. Prompt asked for "Modern, sans-serif".
      }
    },
  },
  plugins: [],
}
