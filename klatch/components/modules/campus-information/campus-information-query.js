import { imageMeta } from 'data/utils'

export const campusInformation = ` _type == 'campusInformation' => {
    _type,
    title,
    subtitle,
    address,
    rightImage {
      ${imageMeta}
    }
  }`
