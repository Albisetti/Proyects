import React from 'react'

import CustomImage from '@components/custom-image'
import styles from './our-story-hero.module.scss'

const OurStoryHero = ({ data = {} }) => {
  const { title, sideImg, frameTitle, frameText, frameImg } = data

  return (
    <div className={styles.heroContainer}>
      <div className={styles.sideImageContainer}>
        <CustomImage photo={sideImg} className={styles.sideImage} />
        <img
          src="/images/our-story-page/side-img-tape.png"
          alt=""
          className={styles.sideTapeImage}
        />
        <img
          src="/images/our-story-page/side-beans.png"
          alt=""
          className={styles.sideBeansImage}
        />
      </div>

      <h1 className={styles.mainTitle}>{title}</h1>

      <div className={styles.frameSectionDiv}>
        <img
          src="/images/our-story-page/book-with-images.png"
          alt=""
          className={styles.bookMobile}
        />
        <div className={styles.frameImageContainer}>
          <img
            src="/images/our-story-page/frame.png"
            alt=""
            className={styles.frameImageBG}
          />
          <CustomImage photo={frameImg} className={styles.frameImage} />
        </div>
        <div className={styles.frameTextDiv}>
          <h2 className={styles.frameTitle}>{frameTitle}</h2>
          <p className={styles.frameText}>{frameText}</p>
        </div>
      </div>
    </div>
  )
}

export default OurStoryHero
