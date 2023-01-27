import Link from 'next/link'

import styles from './styles.module.scss'

import React, { useContext } from 'react'
import { MenuContext } from '@context/menuContext'

function SimpleLink({
  title,
  url = '/',
  target = '_self',
  arrowLink,
  menuSlug,
  amenitiesStyle,
  onClickExtra,
}) {
  const { addMenu } = useContext(MenuContext)
  if (amenitiesStyle) {
    return (
      <div
        className={`group ${styles.amenitiesLinkStyle}`}
        onClick={() => addMenu(menuSlug)}
      >
        <div className={styles.amenitiesItemContent}>
          <a title={title} className={styles.simpleLinkText} target={target}>
            <p>{title}</p>
          </a>
          <div className={styles.arrowContainer}>
            <svg className={styles.simpleLinkArrow} width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="14.5" transform="rotate(-90 15 15)" />
              <path d="M17.8851 9.99983C18.9215 11.9891 20.4079 13.7021 22.2228 14.9993C20.4214 16.312 18.9381 18.0219 17.8851 19.9998L16.8558 19.9998C17.846 18.0844 19.1993 16.3851 20.8384 14.9993C19.1979 13.611 17.8397 11.913 16.8397 9.99983L17.8851 9.99983Z" />
              <path d="M7.77763 15L21.111 15L7.77763 15Z" />
              <path d="M7.77763 15L21.111 15" />
            </svg>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.simpleLinkContainer}>
      {menuSlug ? (
        <span
          onClick={() => {
            addMenu(menuSlug)
            if (onClickExtra) onClickExtra()
          }}
        >
          <div className="flex flex-col">
            <a title={title} className={styles.simpleLinkText} target={target}>
              <p>{title}</p>
            </a>
            {arrowLink && (
              <img
                src="/icons/long-arrow-navyBlue.svg"
                alt=""
                className={styles.simpleLinkArrow}
              />
            )}
          </div>
        </span>
      ) : (
        <Link href={url}>
          <div className="flex flex-col">
            <a title={title} className={styles.simpleLinkText} target={target}>
              <p>{title}</p>
            </a>
            {arrowLink && (
              <img
                src="/icons/long-arrow-navyBlue.svg"
                alt=""
                className={styles.simpleLinkArrow}
              />
            )}
          </div>
        </Link>
      )}
    </div>
  )
}

export default SimpleLink
