import React from 'react'
import styles from './wholesale-first-section.module.scss'


const wholesaleFirstSection = ({ data = {} }) => {

    const { heading, text, imageBackground, firstImage, secondImage, thirdImage } = data

    return (
        <div className={styles.wrapper}>
            <div>
                <h1 className={styles.heading}>{heading}</h1>
                <p className={styles.text}>{text}</p>
            </div>
            <div className={styles.imagesContainer}>
                <img src={imageBackground.url} className={styles.firstBackground} />
                <img src={firstImage.url} className={styles.firstImage} />
                <img src={imageBackground.url} className={styles.secondBackground} />
                <img src={secondImage.url} className={styles.secondImage} />
                <img src={thirdImage.url} className={styles.thirdImage} />
            </div>
        </div>
    )
}

export default wholesaleFirstSection