import { imageMeta, product } from "data/utils"

export const marqueeQuery = `
_type == 'marquee' => {
  _type,
  _key,
  items[]{
    _type == 'simple' => {
      _type,
      text
    },
    _type == 'photo' => {
      _type,
      "photo": {
        ${imageMeta}
      }
    },
    _type == 'product' => {
      _type,
      _id,
      "product": *[_type == "product" && _id == ^ ._ref][0]${product}
    }
  },
  speed,
  reverse,
  pausable
}`;