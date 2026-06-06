/* CSS variables for light/dark; used by Tailwind via utilities (bg, text, border) */module.exports = {
  darkMode: "class", // use class-based dark mode
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // keep theme extensions here if needed
    },
  },
  plugins: [],
};