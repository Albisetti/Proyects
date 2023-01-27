import React from 'react'
import cx from 'classnames'

import SanityWidthImage from './sanity-width-image'

const RichTextImage = ({ image, style, alignment }) => {
  const sizeClassNames = style === 'inline' ? 'w-full sm:w-1/2' : 'w-full'
  const inlineClassNames =
    alignment === 'left'
      ? 'sm:float-left sm:mr-[15px] md:mr-[25px] lg:mr-[60px] xl:mr-[90px]'
      : 'sm:float-right sm:ml-[15px] md:ml-[25px] lg:ml-[60px] xl:ml-[90px]'

  return (
    <SanityWidthImage
      image={image}
      alt={image?.alt}
      className={cx(
        'rich-text-image overflow-hidden sm:mb-[15px] md:mb-[25px] lg:mb-[50px] xl:mb-[70px]',
        sizeClassNames,
        { [inlineClassNames]: style === 'inline' }
      )}
    />
  )
}

export default RichTextImage
