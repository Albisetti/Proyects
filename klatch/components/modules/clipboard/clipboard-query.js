import { imageMeta } from "data/utils"

export const clipboardQuery = `_type == "clipboard" => {
        _type,
        _key,
        overlayingText,
        "clipboardImageObject": clipboardImageObject{
            "clipboardImage": clipboardImage{
                ${imageMeta}
            },
            rotation
        },
        "secondOverlayingImageObject": secondOverlayingImageObject{
            "secondOverlayingImage": secondOverlayingImage{
                ${imageMeta}
            },
            isPolaroid,
            polaroidText,
        },
        "firstOverlayingImage": firstOverlayingImage{
            ${imageMeta}
        },
        "leftImage": leftImage{
            ${imageMeta}
        },
        "leftPolaroidImage": leftPolaroidImage{
            ${imageMeta}
        }
    }`