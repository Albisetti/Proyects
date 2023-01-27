import { useState } from 'react'
import cx from 'classnames'

import CustomImage from '@components/custom-image'
import LocationCard from './location-card'
import CustomLink from '@components/common/custom-link'

import { useWindowSizeAdjustments } from 'util/window-resize'

import styles from './location-grid.module.scss'

function LocationGrid({ data = {} }) {
  const {
    title,
    orderOnlineLink,
    locations = [],
    topRightImage,
    bottomRightImage,
    bottomRightImageMobile,
  } = data

  const [gray, setGray] = useState(false)
  const { windowWidth } = useWindowSizeAdjustments()

  const onModalOpen = (modalOpen) => {
    setGray(modalOpen)
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{title}</h1>

        {windowWidth < 1024 && orderOnlineLink && (
          <CustomLink
            buttonWrapper={styles.orderOnlineButtonMobile}
            title={orderOnlineLink?.title}
            href={`/${orderOnlineLink?.slug}`}
            color="blue"
          />
        )}

        <div className={styles.locationGrid}>
          {locations.map((location, index) => (
            <LocationCard
              key={index}
              location={location}
              onModalOpen={onModalOpen}
            />
          ))}
        </div>
      </div>
      {topRightImage && (
        <CustomImage photo={topRightImage} className={styles.imageTopRight} />
      )}
      {bottomRightImage && (
        <CustomImage
          photo={bottomRightImage}
          className={styles.imageBottomRight}
        />
      )}
      {bottomRightImageMobile && (
        <CustomImage
          photo={bottomRightImageMobile}
          className={styles.imageBottomRightMobile}
        />
      )}
      <div className={cx(styles.gray, { [styles.grayIsVisible]: gray })}></div>
    </section>
  )
}

export default LocationGrid
