import React from 'react'

import CustomImage from '@components/custom-image'
import styles from './our-story-image-cta.module.scss'
import CustomLink from '@components/common/custom-link'

const OurStoryImageCTA = ({ data = {} }) => {
  const { cta, ctaText, ctaButtonText, leftBottomImage, leftTopImage } = data

  return (
    <div className={styles.sectionContainer}>
      {!!leftTopImage?.url && (
        <CustomImage photo={leftTopImage} className={styles.leftTopImage} />
      )}
      {!!leftBottomImage?.url && (
        <CustomImage
          photo={leftBottomImage}
          className={styles.leftBottomImage}
        />
      )}

      <div className={styles.ctaContainer}>
        <h2 className={styles.ctaTitle}>{cta.title}</h2>
        {!!ctaText && (
          <div className={styles.ctaTextContainer}>
            <p>{ctaText}</p>
          </div>
        )}
        {!!cta.href && (
          <CustomLink
            title={ctaButtonText || 'Link'}
            href={cta.href}
            color={cta.color}
          />
        )}
      </div>
    </div>
  )
}

export default OurStoryImageCTA
