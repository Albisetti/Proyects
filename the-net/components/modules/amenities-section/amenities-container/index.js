import React from 'react'
import AmenitiesContent from '../amenities-content'

import styles from './styles.module.scss'

const AmenitiesContainer = ({ data = {} }) => {
  const { amenitiesContent } = data

  return (
    <div className={styles.container} id="elemAmenities">
      <div className={styles.content}>
        <AmenitiesContent data={amenitiesContent} />
      </div>
    </div>
  )
}

export default AmenitiesContainer
