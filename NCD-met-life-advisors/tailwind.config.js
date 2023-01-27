/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "321px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      blue: "#0082B5",
      orange: "#FF8C3E",
      navyBlue: "#003764",
      lightBlue: "#469dc9",
      celadonBlue: "#017EAD",
      grey: "#DDDDDD",
      lightGrey: "#F6F7F7",
      textGrey: "#808080",
      darkGrey: "#565656",
      white: "#FFFFFF",
      black: "#000000",
      red: "#FF0000",
      gradientBlue: "#0182B5",
      backgroundSolidGrey: "#d0e8f2",
    },
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "8rem",
      },
    },
    extend: {
      animation: {
        antMoveIn: "antMoveIn 5s ease-in-out forwards",
      },
      keyframes: {
        antMoveIn: {
          "0%": {
            maxHeight: "0",
            padding: "0",
            opacity: "0",
          },
          "25%": {
            opacity: "1",
          },
          "50%": {
            maxHeight: "150px",
            padding: "25vh",
            opacity: "1",
          },
          "75%": {
            opacity: "1",
          },
          "100%": {
            maxHeight: "0",
            padding: "0",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
