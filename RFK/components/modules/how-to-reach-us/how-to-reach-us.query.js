import { ptContent } from 'data/utils'

export const howToReachUsQuery = `_type == 'howToReachUs' => {
    _type,
    _key,
    mainTitle,
    content[]{
      ${ptContent}
    },
    social[]{
        icon,
        url
      },
    addressTitle,
    street,
    city,
    phoneNumber,
  }`
