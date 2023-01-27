import { imageMeta } from "data/utils"

export const heroQuery = `_type == 'hero' => {
    _type,
    _key,
    title,
    titleSize,
    subtitle,
    subTitleSize,
    cta,
    leftImg {
      firstImage {
        ${imageMeta}
      },
      imageCaption
    },
    rightImg {
      firstImage {
        ${imageMeta}
      },
      secondImage {
        ${imageMeta}
      },
      thirdImage {
        ${imageMeta}
      },
      fourthImage {
        ${imageMeta}
      }
    }
  }`