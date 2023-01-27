export const internalHeroQuery = `
_type == 'internalHero' => {
  _type,
  _key,
  title,
  subtitle,
  "backgroundImage": backgroundImage.asset->url,
}`
