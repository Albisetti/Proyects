import { Transition } from '@headlessui/react'
import React from 'react'
import ReactPlayer from 'react-player'
import styles from './custom-video-player.module.scss'

const CustomVideoPlayer = ({ url, close, show }) => {
  return (
    <Transition show={show} className="">
      <div className={styles.videoWrapper}>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault()
            close()
          }}
          className={styles.closeIconWrapper}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </a>
        <div className={styles.videoPlayerWrapper}>
          <ReactPlayer
            width="100%"
            height="100%"
            className={styles.videoPlayer}
            url={url}
            controls={true}
          />
        </div>
      </div>
    </Transition>
  )
}

export default CustomVideoPlayer
