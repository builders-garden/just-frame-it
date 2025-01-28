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
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-50% - 1.5rem))" },
        },
      },
      animation: {
        shine: "shine 3s infinite linear",
        fadeIn: "fadeIn 0.2s ease-in-out",
        scroll: "scroll 40s linear infinite",
      },
    },
  },
  plugins: [],
};
