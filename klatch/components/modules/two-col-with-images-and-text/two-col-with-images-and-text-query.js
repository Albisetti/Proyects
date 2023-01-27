import { imageMeta } from "data/utils"

export const twoColWithImagesAndTextQuery = `_type == 'twoColWithImagesAndText' => {
    _type,
    _key,
    header,
    awardsText,
    polaroidImages {
      firstImage{
        ${imageMeta}
      },
      secondImage{
        ${imageMeta}
      },
    }
  }`