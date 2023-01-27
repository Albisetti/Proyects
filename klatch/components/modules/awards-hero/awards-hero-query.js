import { imageMeta } from "data/utils"

export const awardsHeroQuery = `_type == "awardsHero" => {
        _type,
        _key,
        "goodFoodAwardImage": goodFoodAwardImage{
        ${imageMeta}
        },
        "coffeeReviewImage": coffeeReviewImage{
        ${imageMeta}
        },
        "polaroidImage": polaroidImage{
        ${imageMeta}
        },
        "goldenBeanEspressoImage": goldenBeanEspressoImage{
        ${imageMeta}
        },
    }`