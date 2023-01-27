module.exports = {
  corePlugins: {
    preflight: false,
  },
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
    screens: {
      xxs: '300px',
      xs: '480px',
      sm: '768px',
      md: '940px',
      lg: '1270px',
      xl: '1920px',
    },
    colors: {
      inherit: 'inherit',
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#FFFFFF',
      pageBG: 'var(--pageBG)',
      pageText: 'var(--pageText)',
      deepBlueLight: 'rgb(18,70,84)', // #124654 (used for nav)
      deepBlueDark: 'rgb(11,62,75)', // #0B3E4B (used for nav hover)
      lightBlue: 'rgb(78,195,224)', // #4EC3E0 (used for nav buttons)
      royalBlue: 'rgb(24,112,184)', // #1870B8 (used in Find Support cta)
      poolBlue: 'rgb(74,193,224)', // #4AC1E0 (used for text in Find Support cta)
      blueGray: 'rgb(228,246,250)', // #E4F6FA (used for Join Our Team bg)
      coolGray: 'rgb(200,200,200)', // #C8C8C8 (used in placeholders)
      slateGray: 'rgb(246,246,246)', // #F6F6F6 (used in Home slider)
      paleBlue: 'rgb(101,135,144)', // #658790 (used in footer)
      emerald: 'rgb(0,176,151)', // #00B097 (used for cta bg, etc.)
      lightGray: '#455C68',
    },
    fontSize: new Array(201)
      .fill()
      .map((_, i) => i)
      .reduce((acc, val) => {
        acc[val] = `${val / 10}rem`
        return acc
      }, {}),
    lineHeight: new Array(161)
      .fill()
      .map((_, i) => i)
      .reduce((acc, val) => {
        acc[val] = val / 100
        return acc
      }, {}),
    spacing: new Array(351)
      .fill()
      .map((_, i) => i)
      .reduce((acc, val) => {
        acc[val] = `${val / 10}rem`
        return acc
      }, {}),
    opacity: new Array(21)
      .fill()
      .map((_, i) => i * 5)
      .reduce((acc, val) => {
        acc[val] = `${val / 100}`
        return acc
      }, {}),
    zIndex: new Array(11)
      .fill()
      .map((_, i) => i)
      .reduce((acc, val) => {
        acc[val] = val
        return acc
      }, {}),
    extend: {
      fontFamily: {
        inherit: 'inherit',
        myriadPro: ['MyriadPro', 'sans-serif'],
        almarose: ['Almarose', 'sans-serif'],
        sentinel: ['Sentinel', 'sans-serif'],
        wingdings: ['Wingdings', 'sans-serif'],
      },
      maxWidth: {
        xs: '20rem',
        sm: '30rem',
        md: '40rem',
        lg: '50rem',
        xl: '60rem',
        '2xl': '70rem',
        '3xl': '80rem',
        '4xl': '90rem',
        '5xl': '100rem',
        '6xl': '115rem',
        '7xl': '130rem',
        prose: '100ch',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
