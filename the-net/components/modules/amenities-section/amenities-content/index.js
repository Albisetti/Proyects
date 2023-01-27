import LinksList from '@components/modules/global/links-list'
import React from 'react'

import styles from './styles.module.scss'

const AmenitiesContent = ({ data = {} }) => {
  const { title, subtitle, linksList } = data

  return (
    <div className={styles.amenitiesContentContainer}>
      <h1 className={styles.amenitiesTitle}>{title}</h1>
      <h2 className={styles.amenitiesSubtitle}>{subtitle}</h2>
      <div className={styles.amenitiesLinkListContainer}>
        <LinksList data={linksList} />
      </div>
    </div>
  )
}

export default AmenitiesContent
