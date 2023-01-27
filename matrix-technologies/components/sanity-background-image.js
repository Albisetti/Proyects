import React from 'react'
import { useNextSanityImage } from 'next-sanity-image'

import { sanityClient } from '@lib/sanity'
import BackgroundImage from './background-image'

const SanityBackgroundImage = ({
  className,
  image,
  alt,
  objectFit,
  objectPosition,
  overlayComponent,
  priority,
  style,
  children,
}) => {
  const imageProps = useNextSanityImage(sanityClient, image)

  return imageProps?.src ? (
    <BackgroundImage
      className={className}
      src={imageProps?.src}
      alt={alt}
      objectFit={objectFit}
      objectPosition={objectPosition}
      blurDataURL={imageProps?.blurDataURL}
      loader={imageProps?.loader}
      priority={priority}
      overlayComponent={overlayComponent}
      style={style}
    >
      {children}
    </BackgroundImage>
  ) : null
}

export default SanityBackgroundImage
