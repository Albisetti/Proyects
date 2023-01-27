import { imageMeta } from 'data/utils'

export const ourStoryMoreInfoQuery = `_type == 'ourStoryMoreInfo' => {
    _type,
    _key,
    title,
    links[]{
      buttonTitle,
      linkDescription,
      linkTarget
    },
    rightBGImage{
      ${imageMeta}
    }
  }`
