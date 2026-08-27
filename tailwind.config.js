/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#07100D",
        "deep-forest": "#0C1B15",
        "glass-surface": "rgba(255,255,255,0.07)",
        "glass-strong": "rgba(255,255,255,0.11)",
        "glass-border": "rgba(255,255,255,0.14)",
        "primary-green": "#0B6B45",
        "secondary-green": "#138A5B",
        "heritage-green": "#064A32",
        gold: "#D6B25E",
        white: "#F7F9F8",
        "muted-text": "#A8B5AF",
        danger: "#C96B62",
      },
      fontFamily: {
        primary: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
        display: ["DM Sans", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "28px",
        md: "24px",
        sm: "20px",
      },
    },
  },
  plugins: [],
};