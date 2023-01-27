import { imageMeta } from "data/utils"

export const productsSliderQuery = `_type == 'productsSlider' => {
    _type,
    _key,
    title,
    collection->{
      _type,
      title,
      products[]->{
        _type,
        title,
        productID,
        slug,
        listingPhotos[]{
          forOption,
          "default": listingPhoto{
            ${imageMeta}
          },
          "hover": listingPhotoHover{
            ${imageMeta}
          },
          "background": backgroundImg{
            ${imageMeta}
          }
        },
      }
    }
  }`