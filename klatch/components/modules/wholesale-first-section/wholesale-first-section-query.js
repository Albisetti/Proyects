import { imageMeta } from "data/utils"

export const wholesaleFirstSectionQuery = `_type == 'wholesaleFirstSection' => {
    _type,
    _key,
    heading,
    text,
    "imageBackground": imageBackground{
        ${imageMeta}
        },
    "firstImage": firstImage{
        ${imageMeta}
        },
    "secondImage": secondImage{
        ${imageMeta}
        },
    "thirdImage": thirdImage{
        ${imageMeta}
        },
}`
