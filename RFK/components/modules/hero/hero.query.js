import { imageMeta } from 'data/utils'

export const heroQuery = `_type == 'hero' => {
    _type,
    _key,
    topNavSpace,
    title,
    subtitle,
    content,
    cta,
    rightImg {
      ${imageMeta}
    }
  }`
