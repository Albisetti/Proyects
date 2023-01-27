import React from 'react'
import styles from './awards-hero.module.scss'
import PolaroidImage from '../polaroid-image/polaroid-image'

const AwardsHero = ({ data = {} }) => {
  const {
    goodFoodAwardImage,
    coffeeReviewImage,
    polaroidImage,
    goldenBeanEspressoImage,
  } = data

  return (
    <div className="overflow-y-hidden overflow-x-hidden">
      <h1 className={styles.heading}>Awards</h1>
      <div className={styles.awardsHeroWrapper}>
        <img
          className={styles.goodFoodAwardImage}
          src={goodFoodAwardImage.url}
        />
        <img src={goldenBeanEspressoImage.url} className={styles.goldenBeanEspressoImage} />
        <img src={coffeeReviewImage.url} className={styles.coffeeReviewImage} />
        <PolaroidImage
          image={polaroidImage.url}
          wrapperClass={styles.leftImageWrapper}
          imageWrapperClass={styles.leftImage}

        />
      </div>
    </div>
  )
}

export default AwardsHero
