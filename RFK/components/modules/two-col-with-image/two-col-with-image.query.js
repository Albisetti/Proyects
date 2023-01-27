import { imageMeta, ptContent } from 'data/utils'

export const twoColWithImage = `_type == 'twoColWithImage' => {
  _type,
  _key,
  title,
  textLeft[]{
    ${ptContent}
  },
  textRight[]{
    ${ptContent}
  },
  image{
    ${imageMeta}
  },
  link{
    title,
    linkType == 'internal' => {
      "url": hrefInternal
    },
    linkType == 'external' => {
      "url": hrefExternal
    },
    target
  }
}
`
