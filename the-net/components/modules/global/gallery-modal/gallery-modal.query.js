import { imageMeta } from "data/utils"

export const galleryModalQuery = `_type == 'galleryModal' => {
    _type,
    _key,
    slug,
    images[]{
        title,
        description,
        image{
            ${imageMeta}
        }
    },  
  }`
