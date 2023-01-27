import { MenuContext } from '@context/menuContext'
import React, { useContext, useEffect, useState } from 'react'

import cx from 'classnames'

import styles from './styles.module.scss'

const BrandVideo = ({ data = {} }) => {
  const { brandVideo, setBrandVideo, setVideoRendering, videoMuted } =
    useContext(MenuContext)
  const [renderVideo, setRenderVideo] = useState(true)
  const [transitionReady, setTransitionReady] = useState(false)

  const [stopVideoInterval, setStopVideoInterval] = useState(null)
  const [stopVideoTimeout, setStopVideoTimeout] = useState(null)

  useEffect(() => {
    const video = document.getElementById('brandVideo')
    if (!brandVideo) {
      const stopVideo = () => {
        if (!video) return
        video?.pause()
        video.currentTime = 0
        setRenderVideo(false)
        setVideoRendering(false)
      }
      const lowerVolume = () => {
        if (!video) return
        if (video?.volume > 0.06) {
          video.volume = video.volume - 0.05
        } else {
          clearInterval(volumeInterval)
        }
      }
      const volumeInterval = setInterval(() => lowerVolume(), 100)
      setStopVideoInterval(volumeInterval)

      setStopVideoTimeout(setTimeout(() => stopVideo(), 2000))
    } else {
      clearInterval(stopVideoInterval)
      clearTimeout(stopVideoTimeout)
      setRenderVideo(true)
      setVideoRendering(true)
      setTransitionReady(true)

      if (video.volume) video.volume = 1
    }
  }, [brandVideo])

  return (
    <div
      className={cx(
        'min-w-[100vw] min-h-[100vh] fixed top-0 z-[90] bg-black',
        brandVideo ? 'opacity-100 visible' : 'opacity-0 invisible',
        { 'transition-all duration-[2s]': transitionReady }
      )}
    >
      {renderVideo && (
        <video
          id="brandVideo"
          className="absolute min-w-[100vw] min-h-[100vh]"
          autoPlay
          muted={videoMuted}
          onEnded={() => setBrandVideo(false)}
        >
          <source src={'/brand-video.mp4'} type="video/mp4"></source>
        </video>
      )}
      <div
        className="absolute bottom-0 right-0 cursor-pointer"
        onClick={() => setBrandVideo(false)}
      >
        <p className={styles.skipVideoButton}>Skip Video</p>
      </div>
    </div>
  )
}

export default BrandVideo
