import { imageMeta } from "data/utils"

export const galleryQuery = `_type == 'gallery' => {
    _type,
    _key,
    images[]{
        title,
        description,
        image{
            ${imageMeta}
        }
    },  
  }`
