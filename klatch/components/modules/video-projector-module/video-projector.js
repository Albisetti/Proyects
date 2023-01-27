import React from 'react'
import ProjectorVideo from '../projector-video/projector-video'

import styles from './video-projector.module.scss'

const VideoProjectorModule = ({ data = {} }) => {
  const { title, videoUpload, videoEmbedURL, videoPreviewImage } = data

  return (
    <div className={styles.videoContainer}>
      <h2 className={styles.mainTitle}>{title}</h2>

      <ProjectorVideo
        data={{ videoURL: videoUpload || videoEmbedURL, videoPreviewImage }}
      />
    </div>
  )
}

export default VideoProjectorModule
