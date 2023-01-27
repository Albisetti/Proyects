import React from 'react'
import { useNextSanityImage } from 'next-sanity-image'

import { sanityClient } from '@lib/sanity'
import WidthImage from './width-image'

function SanityWidthImage({ className, image, alt, priority, style }) {
  const imageProps = useNextSanityImage(sanityClient, image)

  return imageProps?.src ? (
    <WidthImage
      className={className}
      src={imageProps?.src}
      alt={alt}
      type={image?.imageType}
      blurDataURL={imageProps?.blurDataURL}
      width={imageProps?.width}
      height={imageProps?.height}
      loader={imageProps?.loader}
      priority={priority}
      style={style}
    />
  ) : null
}

export default SanityWidthImage
