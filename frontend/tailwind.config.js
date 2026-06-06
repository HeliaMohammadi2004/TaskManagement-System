/* CSS variables for light/dark; used by Tailwind via utilities (bg, text, border) */module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
  ],
  // remove darkMode option (single theme)
  theme: {
    extend: {},
  },
  plugins: [],
};