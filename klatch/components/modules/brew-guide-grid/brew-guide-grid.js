import cx from 'classnames'

import CustomImage from '@components/custom-image'
import styles from './brew-guide-grid.module.scss'
import BrewGuideCard from './brew-guide-card'

function BrewGuideGrid({ data = {} }) {
  const {
    title,
    descriptionMobile,
    descriptionDesktop,
    brewGuides = [],
    decorativeTextFirst,
    decorativeTextLast,
    bottomLeftImage,
    bottomRightImage,
    bottomRightImageMobile,
  } = data

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={cx('h1', styles.title)}>{title}</h1>
        <p className={styles.descriptionMobile}>{descriptionMobile}</p>
        <p className={styles.descriptionDesktop}>{descriptionDesktop}</p>
        <div className={styles.brewGuideGrid}>
          {brewGuides?.map((brewGuide, index) => {
            if (index === 0) {
              return (
                <BrewGuideCard
                  brewGuide={brewGuide}
                  decorationFirst={{
                    imgSrc: '/images/no-to-delete/loop-arrow-first.svg',
                    text: decorativeTextFirst,
                  }}
                  key={index}
                />
              )
            }
            if (index === brewGuides.length - 1) {
              return (
                <BrewGuideCard
                  brewGuide={brewGuide}
                  decorationLast={{
                    imgSrc: '/images/no-to-delete/loop-arrow-last.svg',
                    text: decorativeTextLast,
                  }}
                  key={index}
                />
              )
            }
            return <BrewGuideCard brewGuide={brewGuide} key={index} />
          })}
        </div>
      </div>
      {bottomRightImage && (
        <CustomImage
          photo={bottomRightImage}
          className={styles.bottomRightImage}
        />
      )}
      {bottomLeftImage && (
        <CustomImage
          photo={bottomLeftImage}
          className={styles.bottomLeftImage}
        />
      )}
      {bottomRightImageMobile && (
        <CustomImage
          photo={bottomRightImageMobile}
          className={styles.bottomRightImageMobile}
        />
      )}
    </section>
  )
}

export default BrewGuideGrid
