import CustomImage from '@components/custom-image'
import React from 'react'
import styles from './awards.module.scss'
import PolaroidImage from '../polaroid-image/polaroid-image'

const Awards = ({ data = {} }) => {
  const { title1, title2, awardsList, awardsImages } = data
  return (
    <div className={styles.awardsWrapper}>
      <div className={styles.awards}>
        <h1 className={styles.title1}>{title1}</h1>
        <h1 className={styles.title2}>{title2}</h1>
        <img
          src="/images/no-to-delete/awards-arrow.svg"
          className={styles.awardsArrow}
        />
        <div className={styles.awardsGrid}>
          {awardsList?.map((list, index) => {
            return (
              <p className={styles.listItem} key={index}>
                {' '}
                {list}{' '}
              </p>
            )
          })}
        </div>
      </div>
      <div className={styles.images}>
        <PolaroidImage
          image={awardsImages.polaroidImage}
          wrapperClass={styles.leftImageWrapper}
          imageWrapperClass={styles.leftImage}
          imageClass={styles.leftActualImage}
          textClass={styles.leftImageCaption}
        />
        <CustomImage photo={awardsImages.awardImage} className={styles.medalImage} />
        <CustomImage photo={awardsImages.productImage} className={styles.productImage} />
        <CustomImage photo={awardsImages.annotationImage} className={styles.annotationImage} />
      </div>
    </div>
  )
}

export default Awards
