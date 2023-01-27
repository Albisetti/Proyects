const colors = require("tailwindcss/colors");
var flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette")
  .default;

module.exports = {
  purge: {
    enabled: false,
    content: ["./src/**/**/.{js,jsx,ts,tsx}', './public/index.html"],
    options: {
      safelist: [/^pb-/, /^pt-/, /^mt-/, /^mb-/, /^sm:/, /^md:/, /^lg:/],
    },
  },
  darkMode: false,
  theme: {
    extend: {
      screens: {
        "3xl": "1600px",
        "4xl":"1920px"
      },
      borderWidth:{
        '6': '6px',
      }
    },
    maxWidth:  {
      'xs':'20rem',
      'sm':'24rem',
      'md':'28rem',
      'lg':'32rem',
      'xl':'36rem',
      '2xl':'42rem',
      '3xl':'48rem',
      '4xl':'56rem',
      '5xl':'64rem',
      '6xl':'72rem',
      '7xl':'80rem',
      'full':'100%',
      '200': '200px',
      '250': '250px',
      '300': '300px',
      '350': '350px',
     },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontFamily: {
      body:  ['Roboto', 'sans-serif'],
      title: ['Bitter', 'serif']
  },
    //font size
    fontSize: {
      'xs':'0.75rem',
      'sm': '.875rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
       '5xl': '3rem',
       '6xl': '4rem',
      '7xl': '5rem',
      '8xl': '6rem',
      '9xl': '8rem',
      60: "60px",
      40: "40px",
      30: "30px",
      24: "24px",
      20: "20px",
      18: "18px",
      15: "15px",
      14: "14px",
      12: "12px",
      10: "10px",
    },
    //line height
    lineHeight: {
      72: "72px",
      48: "48px",
      40: "40px",
      36: "36px",
      32: "32px",
      28: "28px",
      26: "26px",
      24: "24px",
      22: "22px",
      20: "20px",
      18: "18px",
      16: "16px",
    },
    colors: {
      ...colors,
      secondary: "#003166",
      brickRed: "#b13626",
      gold: "#9e8443",
      lightPrimary: "rgba(22, 60, 107, 0.5)",
      primary: "#188dc2",
      brickGreen: "#2d7156",
      secondary85:"rgba(0, 49, 102, 0.85)",
      placeHolder:"rgba(43, 37, 37, 0.25)",
      darkgray75:"rgba(43, 37, 37, 0.75)",
      darkGray:"#2b2525"
    },

    minHeight: {
      0: "0px",
      screen:"100vh",
      46:"11.5rem",
      smallMin: "60vmin",
      layout: "68vmin",
      partial: "85vmin",
    },
    maxHeight: (theme) => ({
      ...theme("spacing"),
      smallMin: "60vmin",
      layout: "68vmin",
      partial: "80vmin",
    }),
  },
  variants: {
      borderWidth:['hover','group-hover'],
      textColor: ['group-hover','hover'],
      scrollbar: ["rounded"],
      width: ["responsive", "hover", "focus","group-hover"]
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
    ({ addUtilities, e, theme, variants }) => {
      const colors = flattenColorPalette(theme("borderColor"));
      delete colors["default"];

      const colorMap = Object.keys(colors).map((color) => ({
        [`.border-t-${color}`]: { borderTopColor: colors[color] },
        [`.border-r-${color}`]: { borderRightColor: colors[color] },
        [`.border-b-${color}`]: { borderBottomColor: colors[color] },
        [`.border-l-${color}`]: { borderLeftColor: colors[color] },
      }));
      const utilities = Object.assign({}, ...colorMap);

      addUtilities(utilities, variants("borderColor"));
    },
  ],
};
