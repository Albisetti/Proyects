import React from 'react';
import styles from './two-col-with-images-and-text.module.scss';
import BlockContent from '@components/block-content';
import PolaroidImage from '../polaroid-image/polaroid-image';

const TwoColWithImagesAndText = ({ data = {} }) => {

    const { header, awardsText, polaroidImages } = data

    return (
        <div className={styles.twoColWrapper}>
            <div className={styles.imagesWrapper}>
                <PolaroidImage
                    image={polaroidImages.firstImage.url}
                    wrapperClass={styles.firstImageWrapper}
                    imageWrapperClass={styles.firstImage}
                    imageClass={styles.firstActualImage}
                    textClass={styles.firstImageCaption}

                />
                <PolaroidImage
                    image={polaroidImages.secondImage.url}
                    wrapperClass={styles.secondImageWrapper}
                    imageWrapperClass={styles.secondImage}
                    imageClass={styles.secondActualImage}
                    textClass={styles.secondImageCaption}
                />
            </div>
            <div className={styles.awardsWrapper}>
                <h1 className={styles.header}>{header}</h1>
                <BlockContent className={styles.awardsText} blocks={awardsText} />
            </div>
        </div>
    )

}

export default TwoColWithImagesAndText