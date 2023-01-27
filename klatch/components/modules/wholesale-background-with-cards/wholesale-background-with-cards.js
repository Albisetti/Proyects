import React from 'react'
import styles from './wholesale-background-with-cards.module.scss'
import BlockContent from '@components/block-content'
import CustomCarousel from '@components/common/custom-carousel'

const WholesaleBackgroundWithCards = ({ data = {} }) => {
  const {
    background,
    firstCard,
    secondCard,
    thirdCard,
    mobileBackground,
    firstMobileImage,
    secondMobileImage,
    thirdMobileImage,
  } = data

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktopDisplay}>
        <img src={background.url} className={styles.background} />
        <div className={styles.firstCard}>
          <BlockContent
            className={styles.blockContent}
            blocks={firstCard.cardContent}
          />
          <img src={firstCard.image.url} className={styles.image} />
        </div>
        <div className={styles.secondCard}>
          <BlockContent
            className={styles.blockContent}
            blocks={secondCard.cardContent}
          />
          <img src={secondCard.image.url} className={styles.image} />
        </div>
        <div className={styles.thirdCard}>
          <BlockContent
            className={styles.blockContent}
            blocks={thirdCard.cardContent}
          />
          <img src={thirdCard.image.url} className={styles.image} />
        </div>
      </div>
      <div className={styles?.mobileDisplay}>
        <img src={mobileBackground?.url} />
        <img src={firstMobileImage?.url} className={styles?.firstMobileImage} />
        <CustomCarousel
          wrapperClass={styles.carouselWrapper}
          dotWrapperClass={styles.dotWrapper}
          dotColor={'orange'}
        >
          <div>
            <BlockContent
              className={styles.blockContentMobile}
              blocks={firstCard.cardContent}
            />
            <img src={firstCard.image.url} className={styles.cardImage} />
          </div>
          <div>
            <BlockContent
              className={styles.blockContentMobile}
              blocks={secondCard.cardContent}
            />
            <img src={secondCard.image.url} className={styles.cardImage} />
          </div>
          <div>
            <BlockContent
              className={styles.blockContentMobile}
              blocks={thirdCard.cardContent}
            />
            <img src={thirdCard.image.url} className={styles.cardImage} />
          </div>
        </CustomCarousel>
        <img
          src={secondMobileImage?.url}
          className={styles?.secondMobileImage}
        />
        <img src={thirdMobileImage?.url} className={styles?.thirdMobileImage} />
      </div>
    </div>
  )
}

export default WholesaleBackgroundWithCards
