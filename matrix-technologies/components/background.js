import React, { useRef, useState } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
import ReactPlayer from 'react-player'
import cx from 'classnames'

import SanityBackgroundImage from './sanity-background-image'
import { getImageUrl } from '@util/image'

const Background = ({
  className = null,
  bgType = 'image',
  image,
  alt,
  priority = false,
  videoUrl = null,
  videoType = 'upload',
  videoPreviewImage = null,
  overlayComponent = null,
  style = {},
  children,
}) => {
  const ref = useRef(null)
  const [light, setLight] = useState(false)
  // const [muted, setMuted] = useState(true)
  // const [showVolumeControl, setShowVolumeControl] = useState(true)

  const showPreviewImage = () => {
    if (videoPreviewImage?.url) {
      setLight(getImageUrl(videoPreviewImage, 80))
      // setShowVolumeControl(false)
      ref.current.showPreview()
    }
  }

  return bgType === 'image' ? (
    <SanityBackgroundImage
      className={className}
      image={image}
      alt={alt}
      overlayComponent={overlayComponent}
      priority={priority}
      style={style}
    >
      {children}
    </SanityBackgroundImage>
  ) : (
    <div className={cx(className, 'relative overflow-hidden')} style={style}>
      <ReactPlayer
        className="background-video absolute h-full w-full"
        ref={ref}
        url={videoUrl}
        width="100%"
        height="100%"
        light={light}
        playIcon={<></>}
        playsinline
        playing={true}
        controls={false}
        muted
        onEnded={showPreviewImage}
      />
      {overlayComponent}
      {/* <div className="absolute bottom-0 left-0 z-[5] w-full">
        <div className="px-outer pb-[20px] md:pb-[40px] xxl:container">
          <AnimatePresence>
            {showVolumeControl && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={() => setMuted(!muted)}
                className="appearance-none"
              >
                <img
                  className="grow-hover h-[40px] w-auto"
                  src={muted ? '/svg/muted-icon.svg' : '/svg/volume-icon.svg'}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div> */}
      {children}
    </div>
  )
}

export default Background
