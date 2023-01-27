import React from 'react'
import cx from 'classnames'
import Image from 'next/image'

// See Next.js Image Optimization details below.

function WidthImage({
  className,
  src,
  alt,
  blurDataURL = null,
  type,
  width,
  height,
  loader = null,
  priority = false,
  style = {},
}) {
  return type === 'svg' ? (
    <img
      className={cx(className, 'h-auto')}
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
    />
  ) : (
    <div
      className={cx(className, 'max-w-full')}
      style={{
        ...style,
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        blurDataURL={blurDataURL}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        layout="responsive"
        width={width}
        height={height}
        loader={loader}
        priority={priority}
      />
    </div>
  )
}

/**
 * This is a simple example of how to use the Next/Image component to render
 * an image in its original aspect ratio, controlled by a width style set via
 * className, or perhaps by the style attribute if necessary.
 *
 * Enjoy!
 */

export default WidthImage
