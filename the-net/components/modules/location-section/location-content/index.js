import React from 'react'
import SimpleLink from '@components/simple-link'

import styles from './styles.module.scss'

const LocationContent = ({ data = {}, setWaterfront }) => {
  const {
    title,
    firstDescription,
    mapButtonText,
    secondDescription,
    waterfrontButtonText,
  } = data

  return (
    <div className={styles.locationContentContainer}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.locationDivisor}>
        <div className={styles.locationDivFirst}>
          <p className={styles.descriptionText}>{firstDescription}</p>
          <div className={styles.linkContainer}>
            <SimpleLink
              title={mapButtonText}
              arrowLink={true}
              menuSlug={'location-map'}
              onClickExtra={() => setWaterfront(false)}
            />
          </div>
        </div>
        <div className={styles.locationDiv}>
          <p className={styles.descriptionText}>{secondDescription}</p>
          <div className={styles.linkContainer}>
            <SimpleLink
              title={waterfrontButtonText}
              arrowLink={true}
              menuSlug={'location-map'}
              onClickExtra={() => setWaterfront(true)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationContent
