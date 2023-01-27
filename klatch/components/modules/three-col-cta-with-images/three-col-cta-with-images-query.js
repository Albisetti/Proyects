import { imageMeta } from 'data/utils'

export const threeColCtaWithImagesQuery = `_type == 'threeColCtaWithImages' => {
    _type,
    ctaWithImageList[]{
      title,
      description,
      ctaTitle,
      ctaImage {
        ${imageMeta}
      }
    }
  }`
