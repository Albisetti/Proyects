import { imageMeta } from "data/utils"

export const promotionQuery = `_type == 'promotional' => {
    _type,
    _key,
    title,
    display,
    titleSize,
    subtitle,
    subTitleSize,
    cta,
    leftImg {
      firstImage {
        ${imageMeta}
      },
      secondImage {
        ${imageMeta}
      },
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
    }
  }`