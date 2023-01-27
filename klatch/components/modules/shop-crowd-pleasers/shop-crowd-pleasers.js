import React from 'react'
import { ProductImageLink } from '../products-slider/products-slider'
import BlockContent from '@components/block-content'

import styles from './shop-crowd-pleasers.module.scss'
import { ProductAdd } from '@components/product'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const ShopProductDisplay = (product, idx, specialTitleFont) => (
  <div key={idx} className={styles.productDisplay}>
    {ProductImageLink(product)}
    <p
      className={
        specialTitleFont !== true ? styles.productTitle : styles.titleAltFont
      }
    >
      {product.title}
    </p>
    <BlockContent
      blocks={product.description}
      className={styles.productDescription}
    />
    <ProductAdd
      product={product}
      activeVariant={product.variants[0] || product}
      quantity={1}
    />
  </div>
)

const ShopCrowdPleasers = ({ data = {} }) => {
  const { title, subtitle, products } = data

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    centerMode: true,
    initialSlide: products?.length > 2 ? 1 : 0,
  }

  return (
    <div className={styles.sectionWrapper}>
      <h1 styles={styles.mainTitle}>{title || 'Crowd Pleasers'}</h1>
      {!!subtitle && <p className={styles.mainSubtitle}>{subtitle}</p>}

      <div className={styles.productsContainer}>
        {products.map(ShopProductDisplay)}
      </div>
      <div className={styles.productsContainerMobile}>
        <Slider {...sliderSettings}>
          {products.map((p, idx) => (
            <div key={'main' + idx}>{ShopProductDisplay(p, idx)}</div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default ShopCrowdPleasers
