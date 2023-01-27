import { imageMeta } from 'data/utils'

export const ourStoryHeroQuery = `_type == 'ourStoryHero' => {
    _type,
    _key,
    title,
    sideImg{
      ${imageMeta}
    },
    frameTitle,
    frameText,
    frameImg {
      ${imageMeta}
    }
  }`
