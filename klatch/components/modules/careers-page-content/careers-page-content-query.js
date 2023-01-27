import { imageMeta } from 'data/utils'

export const careersPageContentQuery = `_type == 'careersPageContent' => {
    _type,
    _key,
    title,
    currentOpenings[]{
      title,
      description
    },
    email
  }`
