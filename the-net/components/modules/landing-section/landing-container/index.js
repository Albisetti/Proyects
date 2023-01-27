import React from 'react'
import LandingContent from '../landing-content'

import styles from './styles.module.scss'

const LandingContainer = ({ data = {} }) => {
  const { landingContent } = data

  return (
    <div className={styles.container} id="elemSkyPark">
      <div className={styles.content}>
        <LandingContent data={landingContent} />
      </div>
    </div>
  )
}

export default LandingContainer
