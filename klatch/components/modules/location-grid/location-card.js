import { useState } from 'react'
import cx from 'classnames'
import Link from 'next/link'

import { Transition } from '@headlessui/react'
import PolaroidImage from '../polaroid-image/polaroid-image'
import BlockContent from '@components/block-content'

import { useWindowSizeAdjustments } from 'util/window-resize'

import styles from './location-card.module.scss'
import CustomLink from '@components/common/custom-link'

function LocationCard({ location, onModalOpen }) {
  const {
    name,
    address,
    hours,
    image,
    events,
    orderOnlineTitle,
    orderOnlineSlug,
  } = location

  const [hover, setHover] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { windowWidth } = useWindowSizeAdjustments()

  const controlModalOpen = (open) => {
    setModalOpen(open)
    onModalOpen(open)
  }

  const hasEvents = events && events?.length > 0

  return (
    <div className={styles.cardWrapper}>
      <PolaroidImage
        image={image}
        text={name}
        wrapperClass={cx(styles.leftImageWrapper, {
          [styles.hasMouseOver]: hover || modalOpen,
        })}
        imageWrapperClass={styles.leftImage}
        imageClass={styles.leftActualImage}
        textClass={styles.leftImageCaption}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => (hasEvents ? controlModalOpen(true) : null)}
      />
      <div className={styles.cardContent}>
        <p className={styles.locationText}>{address}</p>
        <p className={styles.locationText}>{hours}</p>
      </div>

      <div className={styles.cardFooter}>
        {windowWidth >= 1024 && orderOnlineTitle && orderOnlineSlug && (
          <Link href={orderOnlineSlug?.current} passHref>
            <a className={styles.button} title={orderOnlineTitle}>
              {orderOnlineTitle}
            </a>
          </Link>
        )}

        {hasEvents && (
          <button
            className={styles.button}
            onClick={() => controlModalOpen(true)}
          >
            Events
          </button>
        )}
      </div>
      <Transition show={modalOpen}>
        <div className={styles.modalWrapper}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {name}
              <br />
              Events
            </h2>
            <svg
              className={styles.close}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 33.84"
              onClick={() => controlModalOpen(false)}
            >
              <defs>
                <style>{'.cls-1{fill:#fff}'}</style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="FPO_Events_Pop_up" data-name="FPO Events Pop up">
                  <path
                    className="cls-1"
                    d="m30.09 0-26 25.24-3.74 3.6c-.27.26 0 2.11 0 2.5v1.76a3.13 3.13 0 0 1 0 .74l26-25.24L30.09 5c.27-.26 0-2.11 0-2.5V.73a3 3 0 0 1 0-.73Z"
                    transform="translate(-.22)"
                  />
                  <path
                    className="cls-1"
                    d="m.35 5 26 25.24 3.71 3.6c-.23-.22 0-2.14 0-2.5v-1.77c0-.13.06-.65 0-.73L4.06 3.6.35 0c.23.22 0 2.14 0 2.5v1.77c0 .13-.06.65 0 .73Z"
                    transform="translate(-.22)"
                  />
                </g>
              </g>
            </svg>
            <img
              className={styles.clip}
              width={148}
              height={175}
              src="/images/no-to-delete/clip.png"
            />
            <div className={styles.eventsList}>
              {events?.map((event, index) => (
                <div className={styles.eventWrapper} key={index}>
                  <h3 className={cx('h2', styles.eventTitle)}>
                    {event?.title}
                  </h3>
                  <BlockContent
                    className={styles.eventDesc}
                    blocks={event?.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default LocationCard
