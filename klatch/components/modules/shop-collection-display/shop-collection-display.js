import React, { useState } from 'react'
import cx from 'classnames'

import styles from './shop-collection-display.module.scss'
import { ShopProductDisplay } from '../shop-crowd-pleasers/shop-crowd-pleasers'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const ShopCollectionDisplay = ({ data = {} }) => {
  const { collections } = data

  const [selectedCollection, setSelectedCollection] = useState(0)

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  }

  const onlyProductsWithImagesFilter = (p) =>
    p.photos?.listing?.length &&
    (!!p.photos.listing[0]?.default || !!p.photos.listing[0]?.background)

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.collectionToggleContainer}>
        <p>Collections</p>
        <div className={styles.collectionsFlex}>
          {collections.map((c, idx) => (
            <div
              key={idx}
              className={cx(styles.collectionToggleBlock, {
                [styles.selected]: idx === selectedCollection,
              })}
              onClick={() => setSelectedCollection(idx)}
            >
              <p>{c.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.collectionDisplay}>
        <h1>{collections[selectedCollection].title} Collection</h1>
        {!!collections[selectedCollection].description && (
          <p className={styles.collectionDescription}>
            {collections[selectedCollection].description}
          </p>
        )}

        <div className={styles.collectionProducts}>
          {collections[selectedCollection].products
            .filter(onlyProductsWithImagesFilter)
            .map((p, idx) => (
              <div key={'main' + idx} className={styles.productWrapper}>
                {p.photos?.listing.length &&
                  !!p.photos?.listing[0]?.textAnnotation && (
                    <div className={styles.textAnnotation}>
                      <img
                        src="/images/no-to-delete/annotation-arrow-right.png"
                        alt=""
                        className={styles.arrowImg}
                      />
                      <p>{p.photos?.listing[0]?.textAnnotation}</p>
                    </div>
                  )}
                {ShopProductDisplay(p, idx, true)}
              </div>
            ))}
        </div>
        <div className={styles.collectionProductsMobile}>
          <Slider {...sliderSettings}>
            {collections[selectedCollection].products
              .filter(onlyProductsWithImagesFilter)
              .map((p, idx) => (
                <div key={'main' + idx}>
                  <div className={styles.productWrapper}>
                    {ShopProductDisplay(p, idx)}
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default ShopCollectionDisplay
