export const shopCrowdPleasersQuery = (product) => {
  return `_type == 'shopCrowdPleasers' => {
    _type,
    _key,
    title,
    subtitle,
    products[]->${product}
  }`
}
