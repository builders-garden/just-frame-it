/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          "0%": { left: "-100%" },
          "20%": { left: "100%" },
          "100%": { left: "100%" },
        },
      },
      animation: {
        shine: "shine 3s infinite linear",
      },
    },
  },
  plugins: [],
};
