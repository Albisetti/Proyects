import { imageMeta } from "data/utils"

export const twoColCtaQuery = `_type == 'twoColCTA' => {
    _type,
    _key,
    title,
    titleSize,
    subtitle,
    subTitleSize,
    cta,
    collageType,
    assetsAnimal {
      firstImg {
        ${imageMeta}
      },
      annotation,
      secondImg {
        ${imageMeta}
      },
      thirdImg {
        ${imageMeta}
      },
      fourthImg {
        ${imageMeta}
      }
    },
    assetsCoffee {
      firstImg {
        ${imageMeta}
      },
      secondImg {
        ${imageMeta}
      },
      thirdImg {
        ${imageMeta}
      },
      fourthImg {
        ${imageMeta}
      },
    },
    assetsPeople {
      firstImg {
        ${imageMeta}
      },
      secondImg {
        ${imageMeta}
      },
      thirdImg {
        ${imageMeta}
      }
    },
    direction
  }`