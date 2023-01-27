import { imageMeta } from 'data/utils'

export const brewGuideGridQuery = ` _type == 'brewGuideGrid' => {
    _type,
    title,
    descriptionDesktop,
    descriptionMobile,
    brewGuides[]->{
      name,
      slug,
      image {
        ${imageMeta}
      },
    },
    decorativeTextFirst,
    decorativeTextLast,
    bottomLeftImage {
      ${imageMeta}
    },
    bottomRightImage {
      ${imageMeta}
    },
    bottomRightImageMobile {
      ${imageMeta}
    }
  }`
