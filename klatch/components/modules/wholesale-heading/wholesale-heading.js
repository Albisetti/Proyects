import React from 'react'
import CtaModule from '../cta/cta-module'
import styles from './wholesale-heading.module.scss'


const WholesaleHeading = ({ data = {} }) => {

    const { title, subtitle, firstCTA, secondCTA } = data

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.text}>{subtitle}</p>
            <div className={styles.ctaWrapper}>
                <div className={styles.cta}>
                    <CtaModule
                        cta={firstCTA}
                    />
                </div>
                <div className={styles.cta}>
                    <CtaModule
                        cta={secondCTA}
                    />
                </div>
            </div>
        </div>
    )
}

export default WholesaleHeading