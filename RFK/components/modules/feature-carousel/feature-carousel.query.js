export const featureCarouselQuery = `_type == 'featureCarousel' => {
  _type,
  _key,
  title,
  items[@->visibility == "visible"]->{
    _type,
    title,
    "slug": slug.current,
    category->{
      "slug": slug.current
    },
    excerpt,
    featuredImage
  }
}`
