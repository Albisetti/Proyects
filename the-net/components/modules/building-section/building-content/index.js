import React from 'react'

import styles from './styles.module.scss'
import LinksList from '@components/modules/global/links-list'

const BuildingContent = ({ data = {} }) => {
  const { title, subtitle, linksList } = data

  return (
    <div className={styles.buildingContentContainer}>
      <h1 className={styles.buildingTitle}>{title}</h1>
      <h2 className={styles.buildingSubtitle}>{subtitle}</h2>
      <div className={styles.buildingLinks}>
        <LinksList data={linksList} />
      </div>
    </div>
  )
}

export default BuildingContent
