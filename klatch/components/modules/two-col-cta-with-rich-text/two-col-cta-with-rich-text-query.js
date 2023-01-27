import { imageMeta } from 'data/utils'

export const twoColCtaWithRichTextQuery = `_type == 'twoColCtaWithRichText' => {
    _type,
    title,
    titleSize,
    subtitle,
    subtitleSize,
    cta,
    direction,
    image {
      ${imageMeta}
    }
  }`
