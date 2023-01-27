import { imageMeta } from 'data/utils'

export const ctaSectionsWithSideNav = `_type == 'ctaSectionsWithSideNav' => {
  _type,
  _key,
  sections[]{
    title,
    items[]{
      title,
      image{
        ${imageMeta}
      },
      description,
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
  }
}
`
