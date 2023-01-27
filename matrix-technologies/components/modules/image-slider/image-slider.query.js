import { imageMeta } from 'data/utils'

export const imageSliderQuery = `_type == 'imageSlider' => {
  _type,
  _key,
  title,
  slides[]{
    image{
      ${imageMeta}
    }
  },
  anchor
}`
