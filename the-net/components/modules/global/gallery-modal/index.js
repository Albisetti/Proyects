import React, { useContext } from 'react'
import { MenuContext } from '@context/menuContext'
import styles from './styles.module.scss'
import cx from 'classnames'

import Gallery from '../gallery'

const GalleryModal = ({ data = {} }) => {
  const { slug } = data
  const { menuOpen } = useContext(MenuContext)

  return (
    <div
      className={cx(
        'fixed top-0 z-[90] transition-all overflow-x-hidden duration-[1.75s] opacity-0 invisible pointer-events-none',
        {
          '!opacity-100 !visible !pointer-events-auto':
            menuOpen?.split('/')[0] === slug,
        }
      )}
    >
      <div className={styles.galleryContainer}>
        <div
          className={cx(
            styles.containedGallery,
            'transition-transform duration-[1.75s] translate-y-[40px]',
            { '!translate-y-0': menuOpen?.split('/')[0] === slug }
          )}
        >
          <Gallery data={data} />
        </div>
      </div>
    </div>
  )
}

export default GalleryModal
