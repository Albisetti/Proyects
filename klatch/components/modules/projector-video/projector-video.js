import { useState } from 'react'

import CustomImage from '@components/custom-image'
import CustomVideoPlayer from '@components/common/custom-video-player'

import styles from './projector-video.module.scss'

function ProjectorVideo({ data = {} }) {
  const { videoURL, videoPreviewImage } = data

  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false)

  return (
    <>
      <div className={styles.videoScreenWrapper}>
        <img
          className={styles.videoScreenImage}
          src="/images/no-to-delete/brew-guides/video-screen-blackbg.jpg"
        />
        <div className={styles.videoPreviewWrapper}>
          {videoPreviewImage ? (
            <CustomImage
              className={styles.videoPreviewImage}
              photo={videoPreviewImage}
            />
          ) : (
            <img
              className={styles.videoPreviewImage}
              src="/images/no-to-delete/brew-guides/video-preview.jpg"
            />
          )}
          <img
            className={styles.playIcon}
            onClick={() => {
              if (videoURL) setVideoPlayerOpen(true)
            }}
            src="/images/no-to-delete/play.svg"
          />
        </div>
        <CustomVideoPlayer
          url={videoURL}
          show={videoPlayerOpen}
          close={() => setVideoPlayerOpen(false)}
        />
      </div>
    </>
  )
}

export default ProjectorVideo
