import SimpleLink from '@components/simple-link'
import React, { useContext, useEffect, useRef, useState } from 'react'
import LandingCarousel from '../landing-carousel'
import cx from 'classnames'

import styles from './styles.module.scss'
import { MenuContext } from '@context/menuContext'
import Cookies from 'js-cookie'

const totalAnimationSteps = 28

const LandingContent = ({ data = {} }) => {
  const { title, subtitleBullets, carousel, image, galleryArrow } = data

  const { skyparkAnim, setSkyparkVideo, setSkyparkAnim, videoMuted } =
    useContext(MenuContext)

  const [entranceInProgress, setEntranceInProgress] = useState(true)
  const [entranceAnimationStep, setEntranceAnimationStep] = useState(0)
  const [playEntranceVideo, setPlayEntranceVideo] = useState(false)

  const containerRef = useRef(null)

  const entranceTrigger = () => {
    const entranceFunc = () => {
      setEntranceInProgress(true)

      let step = 0
      const animInterval = setInterval(() => {
        setEntranceAnimationStep(step++)
        if (step >= totalAnimationSteps - 3 && !playEntranceVideo) {
          setPlayEntranceVideo(true)
          setSkyparkVideo(true)
        }
        if (step >= totalAnimationSteps) {
          clearInterval(animInterval)
        }
      }, 250)
    }
    if (window.innerWidth >= 768) {
      setTimeout(entranceFunc, 1100)
    } else {
      entranceFunc()
    }
  }

  const finishEntrance = () => {
    setEntranceInProgress(false)
    setEntranceAnimationStep(0)
    setPlayEntranceVideo(false)
    setSkyparkVideo(false)
    setSkyparkAnim(false)
    Cookies.set('skyparkAnimDone', '1')
  }

  useEffect(() => {
    if (Cookies.get('skyparkAnimDone')) {
      setEntranceInProgress(false)
    }
  }, [])

  useEffect(() => {
    const video = document.getElementById('skyparkVideo')
    if (playEntranceVideo && !skyparkAnim) {
      const stopVideo = () => {
        if (!video) return
        video?.pause()
        video.currentTime = 0
        finishEntrance()
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
      setEntranceInProgress(false)
      document
        .getElementById('elemVerticalNav')
        ?.dispatchEvent(new Event('skyparkAnimDone'))
      setTimeout(() => stopVideo(), 2000)
    }
  }, [skyparkAnim, playEntranceVideo])

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.addEventListener('entrance', entranceTrigger)
    return () => {
      if (!containerRef.current) return
      containerRef.current.removeEventListener('entrance', entranceTrigger)
    }
  }, [containerRef.current])

  return (
    <>
      {/* Skypark entrance animation container */}
      <div
        className={cx(
          styles.entranceContainer,
          'opacity-100 transition-all duration-[2s] z-10',
          {
            '!opacity-0 invisible':
              entranceAnimationStep === 0 || !entranceInProgress,
          }
        )}
        id="skyParkContainer"
        ref={containerRef}
      >
        <div
          className={cx(
            'absolute min-w-[100vw] h-full opacity-100 transition-opacity duration-[2s] bg-black',
            {
              '!opacity-0 invisible':
                entranceAnimationStep < totalAnimationSteps - 3,
            }
          )}
        >
          {playEntranceVideo && (
            <>
              <video
                id="skyparkVideo"
                className="w-full h-full"
                autoPlay
                muted={videoMuted}
                onEnded={() => setSkyparkAnim(false)}
              >
                <source src={'/brand-video.mp4'} type="video/mp4" />
              </video>
              <div
                className={styles.skipVideoButton}
                onClick={() => setSkyparkAnim(false)}
              >
                <p>Skip Video</p>
              </div>
            </>
          )}
        </div>
        <div
          className={cx(
            styles.entranceTitleContainer,
            'relative translate-y-0 opacity-100',
            {
              '!opacity-0': entranceAnimationStep >= totalAnimationSteps - 1,
            }
          )}
        >
          <div
            className={cx(styles.textContainer, 'opacity-100', {
              '!translate-y-[50%]': entranceAnimationStep < 2,
              '!opacity-0': entranceAnimationStep >= 10,
            })}
          >
            <h1 className={cx(styles.title, styles.entranceTitleColor)}>
              Sky Park
            </h1>
            <p className={cx(styles.subtitle, styles.entranceTitleColor)}>
              Sweeping views to match your vision
            </p>
          </div>
          <div
            className={cx(styles.textContainer, 'opacity-0', {
              '!translate-y-[50%]': entranceAnimationStep < 2,
              '!opacity-100': entranceAnimationStep >= 10,
            })}
          >
            <h1 className={cx(styles.title, 'text-navyBlue')}>Sky Park</h1>
            <p className={cx(styles.subtitle, 'text-navyBlue')}>
              Sweeping views to match your vision
            </p>
          </div>
        </div>
      </div>

      {/* Skypark section content container */}
      <div
        className={cx(styles.landingWholeContainer, {
          'opacity-0 invisible': entranceInProgress,
        })}
      >
        <div
          className={cx(styles.image, styles.imageMain)}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className={styles.landingContentContainer}>
          <h1 className={styles.landingTitle}>{title}</h1>
          <ul className={styles.featuresUl}>
            {subtitleBullets.map((item, key) => (
              <li key={key} className={styles.featuresItems}>
                <p className={styles.featuresItemsText}>{item}</p>
              </li>
            ))}
          </ul>
          <div
            className={cx(styles.image, styles.imageMobile)}
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className={styles.carouselContainer}>
            <LandingCarousel data={carousel} />
          </div>
          <div className={styles.linkContainer}>
            <SimpleLink
              title={galleryArrow?.title}
              arrowLink={galleryArrow?.arrowLink}
              menuSlug={galleryArrow?.menuSlug}
              linkType={galleryArrow?.linkType}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingContent
