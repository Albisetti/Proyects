export const testimonialBlocksQuery = `
_type == 'testimonialBlocks' => {
  _type,
  _key,
  items[]{
    "image": image.asset->url,
    content,
    quoteeName,
    programName
  }
}`
