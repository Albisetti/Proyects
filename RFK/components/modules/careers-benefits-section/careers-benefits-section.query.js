export const careersBenefitsSectionQuery = `
_type == 'careersBenefitsSection' => {
  _type,
  _key,
  title,
  sliderImages[]{
    "url": asset->url
  },
  items[]{
    "image": image.asset->url,
    titleFirst,
    titleSecond
  },
  itemsPadding
}`
