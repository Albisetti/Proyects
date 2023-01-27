import React from 'react'

import CustomImage from '@components/custom-image'
import styles from './promotion.module.scss'
import CtaModule from '../cta/cta-module'
import PolaroidImage from '../polaroid-image/polaroid-image'

const Promotion = ({ data = {} }) => {
  const {
    cta,
    display,
    titleSize,
    leftImg, // { firstImg }
    rightImg, // { firstImg, secondImg, ...}
    subtitle,
    subTitleSize,
    title,
  } = data

  if(!display) {
    return null
  }

  return(
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
            className={styles.leftSecondImage}
          />
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
        </div>
      </div>
    </div>
  )
}

export default Promotion
