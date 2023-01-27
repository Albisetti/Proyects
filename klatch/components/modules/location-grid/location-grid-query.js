import { imageMeta } from 'data/utils'

export const locationGridQuery = ` _type == 'locationGrid' => {
    _type,
    title,
    orderOnlineLink{
      "title": title,
      "slug": page->slug.current
    },
    locations[]->{
      name,
      address,
      hours,
      image {
        ${imageMeta}
      },
      orderOnlineTitle,
      orderOnlineSlug,
      events[]{
        title,
        description
      }
    },
    topRightImage {
      ${imageMeta}
    },
    bottomRightImage {
      ${imageMeta}
    },
    bottomRightImageMobile {
      ${imageMeta}
    }
  }`
