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
      xs: '480px',
      sm: '768px',
      md: '940px',
      lg: '1200px',
      xl: '1440px',
      xxl: '1920px',
    },
    colors: {
      inherit: 'inherit',
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#FFFFFF',
      pageBG: 'var(--pageBG)',
      pageText: 'var(--pageText)',
      midnightBlue: '#122A38',
      navyBlueLight: '#35418F',
      navyBlue: '#242C60',
      navyBlueDark: '#124E71',
      wheat: '#EEBE75',
      darkBlue: '#222A42',
      darkBlueLight: '#7683aa',
      steelBlue: '#437B9B',
      sand: '#F1CA83',
      lightYellow: '#FCEDD1',
      lightBeige: '#C4AC80',
      gold: '#DFC087',
      chardonnay: '#FAD185',
      lightGrey: '#F4F0EA',
      brownBear: '#825933',
      copy: '#4B546D',
      steel: '#B8C3CC',
    },
    fontSize: {
      xs: ['14px', '18.55px'],
      sm: ['16px', '21.2px'],
      base: ['18px', '23.85px'],
      lg: ['32px', '35.2px'],
      xl: ['56px', '61.6px'],
    },
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
    extend: {
      fontFamily: {
        inherit: 'inherit',
        monserrat: 'Montserrat, sans-serif',
        glamourn: 'Glamourn, sans-serif',
        tenorSans: 'Tenor Sans, sans-serif',
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
  plugins: [],
}
