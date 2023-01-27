import { imageMeta } from "data/utils"

export const wholesaleBackgroundWithCardsQuery = `_type == 'wholesaleBackgroundWithCards' => {
    _type,
    _key,
    "background": background{
        ${imageMeta}
    },
    "mobileBackground": mobileBackground{
        ${imageMeta}
    },
    "firstMobileImage": firstMobileImage{
        ${imageMeta}
    },
    "secondMobileImage": secondMobileImage{
        ${imageMeta}
    },
    "thirdMobileImage": thirdMobileImage{
        ${imageMeta}
    },
    "firstCard": firstCard{
        "image": cardImage{
            ${imageMeta}
        },
        cardTitle,
        cardContent
    },
    "secondCard": secondCard{
        "image": cardImage{
            ${imageMeta}
        },
        cardTitle,
        cardContent
    },
    "thirdCard": thirdCard{
        "image": cardImage{
            ${imageMeta}
        },
        cardTitle,
        cardContent
    },
}`
