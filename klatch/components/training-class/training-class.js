import React, { useState } from 'react'
import BlockContent from '@components/block-content'
import PolaroidImage from '@components/modules/polaroid-image/polaroid-image'
import { ProductAdd, ProductOption } from '@components/product'

import styles from './training-class.module.scss'
import CustomVideoPlayer from '@components/common/custom-video-player'

const TrainingClass = ({ trainingClass }) => {
  const classProduct = trainingClass?.classProduct
  if (!classProduct) return null

  const {
    videoUpload,
    videoEmbedURL,
    firstPolaroidImage,
    secondPolaroidImage,
  } = trainingClass
  const videoURL = videoUpload || videoEmbedURL

  const { title, description, options, variants } = classProduct

  const [activeVariant, setActiveVariant] = useState(variants[0])
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false)

  const changeActiveVariant = (variantID) => {
    const newVariant = variants.find((v) => v.id === variantID)
    if (!newVariant) return
    setActiveVariant(newVariant)
  }

  return (
    <section className={styles.wrapper}>
      {/* Side Images */}
      <img
        className={styles.clipboardImage}
        src="/images/training-page/training-roaster-clipboard.png"
        alt=""
      />
      {!!secondPolaroidImage && (
        <img
          className={styles.tapeImage}
          src="/images/training-page/training-roaster-tape.png"
          alt=""
        />
      )}
      <img
        className={styles.beanCupImage}
        src="/images/training-page/training-roaster-beans.png"
        alt=""
      />
      {!!firstPolaroidImage && (
        <div className={styles.firstPolaroid}>
          <PolaroidImage
            image={firstPolaroidImage}
            wrapperClass={styles.imageWrapper}
            imageWrapperClass={styles.image}
            imageClass={styles.actualImage}
          />
          {videoURL && (
            <img
              className={styles.playIcon}
              onClick={() => {
                if (videoURL) setVideoPlayerOpen(true)
              }}
              src="/images/no-to-delete/play.svg"
              alt=""
            />
          )}
        </div>
      )}
      {!!secondPolaroidImage && (
        <div className={styles.secondPolaroid}>
          <PolaroidImage
            image={secondPolaroidImage}
            wrapperClass={styles.imageWrapper}
            imageWrapperClass={styles.image}
            imageClass={styles.actualImage}
          />
        </div>
      )}

      {/* Content */}
      <div className={styles.contentContainer}>
        <h2 className={styles.mainTitle}>{title}</h2>

        <BlockContent blocks={description} className={styles.description} />

        {options && (
          <ProductOption
            option={options[0]}
            variants={variants}
            activeVariant={activeVariant}
            onChange={changeActiveVariant}
          />
        )}

        <ProductAdd
          product={classProduct}
          activeVariant={activeVariant}
          quantity={1}
        />
      </div>
      <div className={styles.bottomDisclaimer}>
        <p className={styles.bottomDisclaimerText}>
          Please also call me if you would like to discuss further or contact
          our office to sign up and pay.
        </p>
        <h2 className={styles.bottomDisclaimerSignature}>- Mike</h2>
      </div>
      <CustomVideoPlayer
        url={videoURL}
        show={videoPlayerOpen}
        close={() => setVideoPlayerOpen(false)}
      />
    </section>
  )
}

export default TrainingClass
