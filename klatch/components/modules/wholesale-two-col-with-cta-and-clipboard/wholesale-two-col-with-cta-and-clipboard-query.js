import { imageMeta } from "data/utils"

export const wholesaleTwoColWithCtaAndClipboardQuery = `_type == "wholesaleTwoColWithCtaAndClipboard" => {
        _type,
        _key,
        textLeft,
        subtitle,
        ctaButton,
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
            "leftPolaroidImage": leftPolaroidImage{
                ${imageMeta}
            }
        },
    }`