import { imageMeta } from "data/utils"

export const twoColTextAndClipboardQuery = `_type == "twoColTextAndClipboard" => {
        _type,
        _key,
        heading,
        text,
        "firstMobileImage": firstMobileImage{
            ${imageMeta}
        },
        "secondMobileImage": secondMobileImage{
            ${imageMeta}
        },
        clipboard{
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
            }
        },
    }`