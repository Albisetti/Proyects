module.exports = {
  content: ['./components/**/*.js', './lib/**/*.js', './pages/**/*.js'],
  safelist: [
    {
      pattern: /grid-cols-/,
      variants: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      pattern: /col-span-/,
      variants: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      pattern: /col-start-/,
      variants: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      pattern: /justify-self-/,
      variants: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      pattern: /self-/,
      variants: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      pattern: /max-w-/,
    },
    {
      pattern: /bg-/,
    },
    {
      pattern: /text-/,
    },
  ],
  theme: {
    container: {
      center: true,
    },
    screens: {
      xs: '320px',
      sm: '425px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      xxl: '1920px',
    },
    colors: {
      inherit: 'inherit',
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#FFFFFF',
      red: '#DC2626',
      darkGray: '#4D4D4D',
      gray: '#707070',
      blue: '#0971CE',
      darkBlue: '#006BBB',
    },
    extend: {
      fontFamily: {
        inherit: 'inherit',
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        blueButton: "url('../public/svg/blueButton.svg')",
        whiteButton: "url('../public/svg/whiteButton.svg')",
        smallBlueButton: "url('../public/svg/smallBlueButton.svg')",
        smallWhiteButton: "url('../public/svg/smallWhiteButton.svg')",
        smallWhiteLines: "url('../public/svg/smallWhiteLines.svg')",
        smallBlueLines: "url('../public/svg/smallBlueLines.svg')",
        whiteLines: "url('../public/svg/whiteLines.svg')",
        blueLines: "url('../public/svg/blueLines.svg')",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
}
