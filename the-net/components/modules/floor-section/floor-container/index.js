import React from 'react'
import FloorContent from '../floor-content'

import styles from './styles.module.scss'

const FloorContainer = ({ data = {} }) => {
  const { floorContent } = data

  return (
    <div className={styles.container} id="elemFloor">
      <div className={styles.content}>
        <FloorContent data={floorContent} />
      </div>
    </div>
  )
}

export default FloorContainer
