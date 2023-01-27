import React from 'react'

import CustomImage from '@components/custom-image'
import styles from './hero.module.scss'
import CtaModule from '../cta/cta-module'
import PolaroidImage from '../polaroid-image/polaroid-image'

const Hero = ({ data = {} }) => {
  const {
    cta,
    titleSize,
    leftImg, // { firstImg }
    rightImg, // { firstImg, secondImg, ...}
    subtitle,
    subTitleSize,
    title,
  } = data

  return (
    <div className={styles.heroWrapper}>
      <div className={styles.content}>
        <PolaroidImage
          image={leftImg.firstImage}
          text={leftImg?.imageCaption}
          wrapperClass={styles.leftImageWrapper}
          imageWrapperClass={styles.leftImage}
          imageClass={styles.leftActualImage}
          textClass={styles.leftImageCaption}
        />

        <CtaModule
          cta={cta}
          title={title}
          titleSize={titleSize}
          subtitle={subtitle}
          subTitleSize={subTitleSize}
        />
        <div className={styles.imagesWrapper}>
          <CustomImage
            photo={rightImg.firstImage}
            className={styles.rightFirstImage}
          />
          <CustomImage
            photo={rightImg.secondImage}
            className={styles.rightSecondImage}
          />
          <CustomImage
            photo={rightImg.thirdImage}
            className={styles.rightThirdImage}
          />
          <CustomImage
            photo={rightImg.fourthImage}
            className={styles.rightFourthImage}
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
