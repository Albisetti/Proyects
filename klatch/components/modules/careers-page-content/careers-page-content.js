import React, { useState } from 'react'
import cx from 'classnames'

import CustomImage from '@components/custom-image'
import styles from './careers-page-content.module.scss'
import CustomLink from '@components/common/custom-link'

const CareersPageContent = ({ data = {} }) => {
  const { title, currentOpenings, email } = data

  const [selectedOpening, setSelectedOpening] = useState(0)

  return (
    <div className={styles.mainContainer}>
      <img
        src="/images/no-to-delete/brew-guides/cherries-2.png"
        alt=""
        className={styles.bgSideImage}
      />
      <img
        src="/images/careers-page/coffee3.png"
        alt=""
        className={styles.bgSideImageCoffee}
      />

      <h1 className={styles.mainTitle}>{title}</h1>

      <div className={styles.openingsContainer}>
        <p className={styles.openingsTitle}>Current Openings</p>
        <div className={styles.openingsDiv}>
          {currentOpenings.map((opening, idx) => (
            <div
              key={idx}
              className={cx(styles.openingsTitleBlock, {
                [styles.selected]: idx === selectedOpening,
              })}
              onClick={() => setSelectedOpening(idx)}
            >
              <p>{opening.title}</p>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.openingDescription}>
        {!!currentOpenings?.length &&
          currentOpenings[selectedOpening].description}
      </p>
      {!!email && (
        <div className={styles.emailButtonWrapper}>
          <CustomLink
            href={`mailto:${email}`}
            className={styles.emailButton}
            title="Email Us Now"
            color="orange"
          />
        </div>
      )}
      <div className={styles.topSpacing} />
    </div>
  )
}

export default CareersPageContent
