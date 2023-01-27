import React from 'react'
import PolaroidImage from '../polaroid-image/polaroid-image'
import styles from './clipboard.module.scss'
import BlockContent from '@components/block-content'

const Clipboard = ({ data = {} }) => {
    const { clipboardImageObject, firstOverlayingImage, secondOverlayingImageObject, overlayingText, leftImage, leftPolaroidImage } = data
    return (
        <div className={styles.clipboardWrapper}>
            {secondOverlayingImageObject?.isPolaroid ?
                <PolaroidImage
                    wrapperClass={styles.secondImagePolaroidWrapper}
                    imageWrapperClass={styles.polaroidImage}
                    imageClass={styles.actualImage}
                    textClass={styles.imageCaption} image={secondOverlayingImageObject?.secondOverlayingImage}
                    text={secondOverlayingImageObject?.polaroidText}
                />
                :
                <img src={secondOverlayingImageObject?.secondOverlayingImage?.url} className={styles.secondImage} />
            }
            {leftPolaroidImage ?
                <PolaroidImage
                    wrapperClass={styles.leftImagePolaroidWrapper}
                    imageWrapperClass={styles.leftPolaroidImage}
                    imageClass={styles.leftActualImage}
                    textClass={styles.leftImageCaption} image={leftPolaroidImage}
                />
                : null}
            {leftImage ? <img className={styles.leftImage} src={leftImage?.url} />
                : null}
            <img className={clipboardImageObject?.rotation === "left" ? styles.clipboardImageLeft : styles.clipboardImageRight}
                src={clipboardImageObject?.clipboardImage?.url} />
            <img className={clipboardImageObject?.rotation === "left" ? styles.firstImageLeft : styles.firstImageRight} src={firstOverlayingImage?.url} />
            {
                overlayingText ?
                    <BlockContent className={styles.overlayingText} blocks={overlayingText} />
                    : null
            }
        </div>
    )
}

export default Clipboard