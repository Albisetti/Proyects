import CustomVideoPlayer from '@components/common/custom-video-player'
import CustomImage from '@components/custom-image'
import React, { useState } from 'react'
import styles from './polaroid-image.module.scss'

const PolaroidImage = ({
  image,
  text = '',
  wrapperClass = '',
  imageWrapperClass = '',
  imageClass = '',
  textClass = '',
  isVideo = false,
  videoUrl = '',
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const [modalState, setModalState] = useState(false)

  return (
    <>
      <div
        className={`${styles.leftImageWrapper} ${wrapperClass}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <div className={`${styles.leftImage} ${imageWrapperClass} `}>
          {isVideo ? (
            <div className="relative">
              <CustomImage
                photo={image}
                className={`${styles.leftActualImage} ${imageClass}`}
              />
              <img
                className={styles.playIcon}
                id="playVideoButton"
                onClick={() => setModalState(true)}
                src="/images/no-to-delete/play.svg"
              />
            </div>
          ) : (
            <CustomImage
              photo={image}
              className={`${styles.leftActualImage} ${imageClass}`}
            />
          )}
          <p className={`${styles.leftImageCaption} ${textClass}`}>{text}</p>
        </div>
      </div>
      {modalState ? (
        <CustomVideoPlayer
          url={videoUrl}
          show={modalState}
          close={() => setModalState(false)}
        />
      ) : null}
    </>
  )
}

export default PolaroidImage
