import React, { useRef } from 'react'
import cx from 'classnames'
import Slider from 'react-slick'
import styles from './products-slider.module.scss'
import CustomImage from '@components/custom-image'
import Link from 'next/link'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const ProductImageLink = (product) => {
  const productBgPhoto = product.listingPhotos?.length
    ? product.listingPhotos[0]?.background
    : !!product.photos?.listing?.length
    ? product.photos.listing[0]?.background
    : null
  const productPhoto = product.listingPhotos?.length
    ? product.listingPhotos[0]?.default
    : !!product.photos?.listing?.length
    ? product.photos.listing[0]?.default
    : null

  if (!productPhoto || !productPhoto.url) return null

  return (
    <Link
      href={{ pathname: `/products/${product.slug.current || product.slug}` }}
    >
      <a className={styles.productContainer}>
        {!!productBgPhoto && !!productBgPhoto.url && (
          <CustomImage
            photo={productBgPhoto}
            className={styles.productBgPhoto}
          />
        )}
        <CustomImage photo={productPhoto} className={styles.productPhoto} />
      </a>
    </Link>
  )
}

const ProductsSlider = ({ data = {}, product }) => {
  const { title, collection } = data

  const products = collection.products.filter(
    (p) => !!p.listingPhotos?.length && (!product || p.productID !== product.id)
  )
  if (!products) return null

  const sliderRef = useRef(null)

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <div className={styles.productsSliderMainDiv}>
      {!!title && <h2>{title}</h2>}
      <div className="relative">
        <div className={styles.arrowsContainer}>
          <div
            className={cx(styles.arrow, styles.arrowLeft)}
            onClick={() => sliderRef.current?.slickPrev()}
          />
          <div
            className={cx(styles.arrow, styles.arrowRight)}
            onClick={() => sliderRef.current?.slickNext()}
          />
        </div>
        <div className={styles.sliderContainer}>
          <Slider ref={sliderRef} {...sliderSettings}>
            {products.map((p, idx) => (
              <div key={idx}>{ProductImageLink(p)}</div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default ProductsSlider
