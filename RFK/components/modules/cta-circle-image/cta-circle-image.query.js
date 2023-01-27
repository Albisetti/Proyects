import { imageMeta, ptContent } from 'data/utils'

export const ctaCircleImageQuery = `_type == 'ctaCircle' => {
    _type,
    _key,
    title,
    content[]{
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
    },
    background,
    largerMaxWidth
  }`
