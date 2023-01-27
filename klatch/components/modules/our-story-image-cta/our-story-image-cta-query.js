import { imageMeta } from 'data/utils'

export const ourStoryImageCTAQuery = `_type == 'ourStoryImageCTA' => {
    _type,
    _key,
    cta,
    ctaText,
    ctaButtonText,
    leftBottomImage{
      ${imageMeta}
    },
    leftTopImage{
      ${imageMeta}
    }
  }`
