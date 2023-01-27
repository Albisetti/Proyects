import React from 'react'
import styles from './roast-hero.module.scss'

const RoastHero = ({ data = {} }) => {
  const {
    title,
    subtitle
  } = data

  return (
    <div className={styles.roastHeroWrapper}>
      <h1 className={styles.heading}>{title}</h1>
      <p className={styles.text}> {subtitle}</p>
    </div>
  )
}

export default RoastHero
