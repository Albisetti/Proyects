import React from 'react'
import styles from './product-option-size-bag.module.scss'

const bagSizeClasses = {
  '310g': styles.sizeOptionSmall,
  '310 g bag': styles.sizeOptionSmall,
  '2 lb bag': styles.sizeOptionMedium,
  '2lb pkg': styles.sizeOptionMedium,
  '5 lb bag': styles.sizeOptionLarge,
  '5lb pkg': styles.sizeOptionLarge,
}

const ProductSizeBagImage = ({ size, filled }) => (
  <img
    src={
      filled
        ? '/images/no-to-delete/product-hero-size-full.png'
        : '/images/no-to-delete/product-hero-size-empty.png'
    }
    alt=""
    className={bagSizeClasses[size.toLowerCase()] || styles.sizeOptionMedium}
  />
)

export default ProductSizeBagImage
