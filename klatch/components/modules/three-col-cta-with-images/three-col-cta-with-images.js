import { useState } from 'react'
import cx from 'classnames'

import styles from './three-col-cta-with-images.module.scss'

import CustomCarousel from '@components/common/custom-carousel'
import CustomButton from '@components/common/custom-button'
import CustomImage from '@components/custom-image'

const borderStyles = [
  styles.borderOrange,
  styles.borderGreen,
  styles.borderBlue,
]

const ThreeColCtaWithImages = ({ data = {} }) => {
  const { ctaWithImageList } = data

  const [imageIndex, setImageIndex] = useState(-1)

  const CtaWithImageComponent = (item, index) => {
    const titleSplit = item?.title?.split('-')[0]?.split(' ')

    return (
      <div key={index} className={styles.productPlan}>
        <div className={styles.productTitleContainer}>
          <div className={styles.productTitleBG} />
          <div
            className={cx(styles.productTitleBorder, borderStyles[index % 3])}
          />
          <div className={styles.productTitleText}>
            <h2>{titleSplit[0]}</h2>
            {titleSplit.length > 1 && <h2>{titleSplit.slice(1).join(' ')}</h2>}
          </div>
        </div>

        <div className={styles.productContentSpacing}>
          {item?.description && (
            <p className={styles.productDescription}>{item?.description}</p>
          )}
          <CustomButton
            className={styles.readMoreButton}
            title={item?.ctaTitle}
            onClick={() => setImageIndex(index)}
          />
        </div>
      </div>
    )
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {ctaWithImageList?.map(CtaWithImageComponent)}
      </div>
      <CustomCarousel
        wrapperClass={styles.carouselMobile}
        dotWrapperClass={styles.carouselDotWrapper}
        dotColor="orange"
      >
        {ctaWithImageList?.map((item, index) => (
          <div key={'main-' + index}>{CtaWithImageComponent(item, index)}</div>
        ))}
      </CustomCarousel>
      <div
        className={cx(styles.ctaImageModal, {
          [styles.open]: imageIndex !== -1,
          [styles.closed]: imageIndex === -1,
        })}
        onClick={() => setImageIndex(-1)}
      >
        <CustomImage
          className={styles.ctaImage}
          photo={ctaWithImageList?.[imageIndex]?.ctaImage}
        />
        <svg viewBox="0 0 460.775 460.775" className={styles.close}>
          <path d="M285.08 230.397 456.218 59.27c6.076-6.077 6.076-15.911 0-21.986L423.511 4.565a15.55 15.55 0 0 0-21.985 0l-171.138 171.14L59.25 4.565a15.551 15.551 0 0 0-21.985 0L4.558 37.284c-6.077 6.075-6.077 15.909 0 21.986l171.138 171.128L4.575 401.505c-6.074 6.077-6.074 15.911 0 21.986l32.709 32.719a15.555 15.555 0 0 0 21.986 0l171.117-171.12 171.118 171.12a15.551 15.551 0 0 0 21.985 0l32.709-32.719c6.074-6.075 6.074-15.909 0-21.986L285.08 230.397z" />
        </svg>
      </div>
    </section>
  )
}

export default ThreeColCtaWithImages
