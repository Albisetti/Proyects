export const shopCollectionDisplayQuery = (product) => {
  return `_type == 'shopCollectionDisplay' => {
    _type,
    _key,
    collections[]->{
      title,
      description,
      products[]->${product}
    }
  }`
}
