import React from 'react'
import BuildingContent from '../building-content'

import styles from './styles.module.scss'

const BuildingContainer = ({ data = {} }) => {
  const { buildingContent } = data

  return (
    <div className={styles.container} id="elemBuilding">
      <div className={styles.content}>
        <BuildingContent data={buildingContent} />
      </div>
    </div>
  )
}

export default BuildingContainer
