import CustomLink from '@components/common/custom-link'
import React from 'react'
import CtaModule from '../cta/cta-module'
import styles from './stay-in-touch.module.scss'

const stayInTouch = ({ data = {} }) => {
  const { leftCTA, leftTitle, rightCTA, rightSubTitle, rightTitle } = data
  return (
    <div className={styles.stayInTouchWrapper}>
      <div className={styles.leftWrapper}>
        <div className={styles.leftWhiteBox}>
          <img src="/images/no-to-delete/logo.svg" className={styles.logo} />
          <p className={styles.leftTitle}>{leftTitle}</p>
          <div className={styles.leftCTAWrapper}>
            <CustomLink color={leftCTA.color} title={leftCTA.title} href={leftCTA.href} buttonWrapper={styles.buttonWrapper} />
          </div>
        </div>
        <div className={styles.leftBlueBox}></div>
        <div className={styles.leftGreenBox}></div>
      </div>
      <div className={styles.rightWrapper}>
        <CtaModule
          cta={rightCTA}
          title={rightTitle}
          titleSize={"h2"}
          subtitle={rightSubTitle}
          subTitleSize={"regular"} />
      </div>
    </div>
  )
}

export default stayInTouch
