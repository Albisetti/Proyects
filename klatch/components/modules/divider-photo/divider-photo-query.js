import { imageMeta } from "data/utils"

export const dividerPhotoQuery = `_type == 'dividerPhoto' => {
    _type,
    _key,
    photo{
      ${imageMeta}
    }
  }`