import React, { useState } from 'react'
import BlockContent from '@components/block-content';
import Clipboard from '../clipboard/clipboard';
import styles from './two-col-text-and-clipboard.module.scss'
import CustomLink from '@components/common/custom-link'


const TwoColTextAndClipboard = ({ data = {} }) => {
    const { heading, text, clipboard, firstMobileImage, secondMobileImage } = data
    return (
        <div className={styles.wrapper}>
            <div className={styles.leftWrapper}>
                <div className={styles.textWrapper}>
                    <h1 className={styles.heading}>{heading}</h1>
                    <BlockContent className={styles.text} blocks={text} />
                    <img src={firstMobileImage?.url} className={styles.firstMobileImage} />
                    <img src={secondMobileImage?.url} className={styles.secondMobileImage} />
                    <div className={styles.selectWrapper}>
                        <div>
                            <span className={styles.firstLabel}>DATE</span>
                            <span className={styles.secondLabel}>QUANTITY</span>
                        </div>
                        <select
                            name="dateOption"
                            className={styles.grindOptionSelect} >
                            <option>Nov, 15, 2022</option>
                        </select>
                        <select
                            name="grindOption"
                            className={styles.grindOptionSelect} >
                            <option>1</option>
                        </select>
                        <div className={styles.secondLabelWrapper}>
                            <span className={styles.firstLabel}>LOCATION</span>
                            <span className={styles.secondGroupLabel}>SCA CERTIFICATION TEST (OPT.)</span>
                        </div>
                        <select
                            name="grindOption"
                            className={styles.grindOptionSelect} >
                            <option>Rancho Cucamonga</option>
                        </select>
                        <select
                            name="grindOption"
                            className={styles.grindOptionSelect} >
                            <option>Yes (Add $100)</option>
                        </select>
                    </div>
                    <div className={styles.cta}>
                        <div className={styles.ctaText}>
                            <CustomLink title='ADD TO CART $15.26' href='www.google.com' color='orange' />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.clipboard}>
                <Clipboard data={clipboard} />
            </div>
        </div>
    )
}

export default TwoColTextAndClipboard