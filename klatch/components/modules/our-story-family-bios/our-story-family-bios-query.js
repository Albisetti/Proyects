import { imageMeta } from 'data/utils'

export const ourStoryFamilyBiosQuery = `_type == 'ourStoryFamilyBios' => {
    _type,
    _key,
    title,
    members[]{
      image{
        ${imageMeta}
      },
      name,
      description
    }
  }`
