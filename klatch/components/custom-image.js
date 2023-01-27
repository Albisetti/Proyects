import { imageBuilder } from '@lib/sanity'
import React from 'react'

const CustomImage = ({photo,className= ''}) => {

  if (!photo) return null

  const assetUrl = imageBuilder.image(photo).url();

  return (
      <img src={assetUrl} className={className} />
  )
}

export default CustomImage;