import React, { useState } from 'react'
import cx from 'classnames'

import CustomCarousel from '@components/common/custom-carousel'
import CustomImage from '@components/custom-image'
import styles from './our-story-family-bios.module.scss'

const Hero = ({ data = {} }) => {
  const { title, members } = data

  const [descriptionExtended, setDescriptionExtended] = useState(
    new Array(members.length).fill(false)
  )

  const toggleDescription = (idx) => {
    const newArray = Object.assign([], descriptionExtended)
    newArray[idx] = !newArray[idx]
    setDescriptionExtended(newArray)
  }

  const MemberDiv = (m, idx) => (
    <div key={idx} className={styles.memberDiv}>
      <div className={styles.polaroidContainer}>
        {m.image && (
          <CustomImage photo={m.image} className={styles.polaroidImage} />
        )}
      </div>
      <div className={styles.memberTextContainer}>
        <h2 className={styles.memberName}>{m.name}</h2>
        <p
          className={cx(styles.memberDescription, {
            [styles.closed]: !descriptionExtended[idx],
          })}
        >
          {m.description}
        </p>
        <p
          className={styles.readMoreButton}
          onClick={() => toggleDescription(idx)}
        >
          {!descriptionExtended[idx] ? 'Read More' : 'Collapse'}
        </p>
      </div>
    </div>
  )

  return (
    <div className={styles.sectionContainer}>
      <h1 className={styles.mainTitle}>{title}</h1>

      <div className={styles.polaroidsSection}>{members.map(MemberDiv)}</div>
      <div className={styles.polaroidsSectionMobile}>
        <CustomCarousel
          wrapperClass={styles.carouselWrapper}
          dotWrapperClass={styles.dotWrapper}
          dotColor={'orange'}
        >
          {members.map(MemberDiv)}
        </CustomCarousel>
      </div>
    </div>
  )
}

export default Hero
