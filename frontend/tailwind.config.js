/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBg: "#020617",
        primaryBorder: "#94a3b8",
        primaryBorderDark: "#262626",
        primaryDark: "#9400FF",
        primaryDarkHover: "#AA33FF",
        primaryLight: "#C370FF",
        primaryLightHover: "#B247FF",
      },
      backgroundImage: {
        highlight:
          "linear-gradient(90deg, rgba(117,73,242,1) 1%, rgba(63,89,228,1) 28%, rgba(76,183,163,1) 63%, rgba(242,141,53,1) 99%);",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        slide: "85s slide infinite linear",
      },
    },
  },
  plugins: [],
};
