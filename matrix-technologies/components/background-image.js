import React from 'react'
import cx from 'classnames'
import Image from 'next/image'

// See Next.js Image Optimization details below.

const BackgroundImage = ({
  className = null,
  src,
  alt,
  blurDataURL = null,
  objectFit = 'cover',
  objectPosition = 'center center',
  overlayComponent = null,
  style = {},
  loader = null,
  unoptimized = null,
  priority = false,
  children,
}) => {
  return (
    <div className={cx(className, 'relative')} style={style}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit={objectFit}
        objectPosition={objectPosition}
        blurDataURL={blurDataURL}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        loader={loader}
        unoptimized={unoptimized}
        priority={priority}
      />
      {overlayComponent}
      {children}
    </div>
  )
}

/**
 * This is a simple example of how to use the Next/Image component as a background
 * to both leverage the optimization features, but also get it to behave as if
 * you're using the CSS background-image property.
 *
 * The pattern works like this:
 *
 * -----------------------------------------------------------
 * <div id="container" className="relative">
 *    <Image
 *      src="./example.png"
 *      alt="Example"
 *      layout="fill"
 *      objectFit="center"
 *      objectPosition="center center"
 *      quality={100}
 *    />
 *    <div id="overlay" className="absolute w-full h-full" />
 *    {children}
 * </div>
 * -----------------------------------------------------------
 *
 * Note: The classNames applied above are just the required ones to make the
 * pattern work, more styling can be applied.
 *
 * So essentially the "fill" layout will fill the container, and object-fit and
 * object-position values are passed as props to control the sizing and position.
 *
 * The children, or content, can then control the size of the container, or the
 * children can be wrapped in an "absolute" element to take up the full width
 * and height of the container—two common use cases.
 *
 * Enjoy!
 */

export default BackgroundImage
