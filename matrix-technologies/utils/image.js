import { imageBuilder } from '@lib/sanity'

export const getImageUrl = (image, quality = 40) => {
  // If the asset property is missing, meaning the image query did not include it,
  // return the default URL.
  if (!image?.asset || !image?.asset?._ref) return image?.url

  // Otherwise, return the image URL with compression enabled.
  return imageBuilder.image(image).quality(quality).auto('format').url()
}

export const shopifyLoader = ({ src, width }) => `${src}&width=${width}`
