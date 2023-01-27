import CustomImage from '@components/custom-image'
import React, { useState } from 'react'
import cx from 'classnames'
import styles from './product-hero.module.scss'
import ProductOption from '@components/product/product-option'
import { ProductAdd, ProductQuantityCounter } from '@components/product'

const productOptionObjs = {
  size: { sortWeight: -1, className: styles.sizeOption },
  frequency: { sortWeight: 0, className: styles.frequencyOption },
  grind: { sortWeight: 1, className: styles.grindOption },
}

const getOptionObjIndex = (opt) => {
  const optLC = opt.toLowerCase()
  if (optLC.includes('grind')) return 'grind'
  if (optLC.includes('size')) return 'size'
  if (optLC.includes('one-time') || optLC.includes('frequency'))
    return 'frequency'
  return opt
}

const getOptionSortWeight = (opt) => {
  const optIdx = getOptionObjIndex(opt)
  if (productOptionObjs.hasOwnProperty(optIdx))
    return productOptionObjs[optIdx].sortWeight
  return 0
}

const getOptionStyle = (opt) => {
  const optIdx = getOptionObjIndex(opt)
  if (productOptionObjs.hasOwnProperty(optIdx))
    return productOptionObjs[optIdx].className
  return null
}

const ProductHero = ({ product, activeVariant, onVariantChange }) => {
  const [productImageSwitch, setProductImageSwitch] = useState(false)

  const [productQuantity, setProductQuantity] = useState(1)

  const firstListing =
    product.photos.listing?.length > 0 ? product.photos.listing[0] : null
  const bgImage = !!firstListing ? firstListing?.background : null
  const mainImage = !!firstListing ? firstListing?.default : null
  const bgSideImages = !!firstListing ? firstListing?.sideImageList : null
  const textImage = !!firstListing ? firstListing?.hover : null
  const textAnnotation = !!firstListing ? firstListing?.textAnnotation : null

  const textImageSwitch = !!textImage && productImageSwitch

  const productCounter = (
    <ProductQuantityCounter
      activeVariant={activeVariant}
      onChange={(q) => setProductQuantity(q)}
    />
  )

  const productSortFunc = (a, b) =>
    getOptionSortWeight(a.name) || 0 - getOptionSortWeight(b.name) || 0

  return (
    <section className={styles.mainHeroDiv}>
      <h1 className={styles.titleMobile}>{product.title}</h1>
      <div className={styles.mainContainer}>
        <div className={styles.productBGSideCoffeeContainer}>
          {product.photos.sideBgImage && (
            <CustomImage
              photo={product.photos.sideBgImage.image}
              className={styles.productBGSideCoffee}
            />
          )}
        </div>
        {/* Side div with product image */}
        <div className={styles.productImageDiv}>
          <div
            className={styles.productImageContainer}
            onClick={() => setProductImageSwitch(!productImageSwitch)}
          >
            {/* Product Image + Background + Side Images */}
            <div className={styles.productImageBGContainer} />
            {bgImage && (
              <CustomImage
                photo={bgImage}
                className={cx(styles.productImageBG, {
                  'opacity-0': textImageSwitch,
                })}
              />
            )}
            {mainImage && (
              <CustomImage
                photo={mainImage}
                className={cx(styles.productImage, {
                  'opacity-0': textImageSwitch,
                })}
              />
            )}
            {bgSideImages && (
              <div
                className={cx(styles.productImageBGSidesContainer, {
                  'opacity-0': textImageSwitch,
                })}
              >
                {bgSideImages.map((sideImg, idx) => (
                  <CustomImage
                    key={idx}
                    photo={sideImg.image}
                    className={styles[sideImg.position || 'topLeft']}
                  />
                ))}
              </div>
            )}

            {/* Text Image for Product */}
            <CustomImage
              photo={textImage}
              className={cx(styles.productImageBG, {
                'opacity-0': !textImageSwitch,
              })}
            />

            {/* Annotation Text */}
            {textAnnotation && (
              <div
                className={cx(styles.annotationTextContainer, {
                  'opacity-0': textImageSwitch,
                })}
              >
                <h2>{textAnnotation}</h2>
                <img
                  src="/images/no-to-delete/annotation-arrow-right.png"
                  alt=""
                />
              </div>
            )}
          </div>
        </div>

        {/* Product options */}
        <div className={styles.contentDiv}>
          <div className={styles.titleContainer}>
            <h1>{product.title.split(' ')[0]}</h1>
            {product.title.split(' ').length > 1 && (
              <h1>{product.title.split(' ').slice(1).join(' ')}</h1>
            )}
          </div>

          {product.options.sort(productSortFunc).map((opt, idx) => {
            const ProdOptionElement = (
              <ProductOption
                key={idx}
                option={opt}
                variants={product.variants}
                activeVariant={activeVariant}
                onChange={onVariantChange}
                optionClassName={getOptionStyle(opt.name)}
              />
            )
            if (!opt.name.includes('Grind')) {
              return ProdOptionElement
            } else {
              return (
                <div key={idx} className={styles.doubleOptionDiv}>
                  {productCounter}
                  {ProdOptionElement}
                </div>
              )
            }
          })}

          {/* Quantity picker if 'grind' option is missing */}
          {!product.options.find((opt) => opt.name.includes('Grind')) && (
            <div className={styles.doubleOptionDiv}>{productCounter}</div>
          )}

          <ProductAdd
            product={product}
            activeVariant={activeVariant}
            quantity={productQuantity}
          />
        </div>

        {/* Size option mobile */}
        <div className={styles.sizeOptionDivMobile}>
          <ProductOption
            option={product.options.find((opt) =>
              opt.name.toLowerCase().includes('size')
            )}
            variants={product.variants}
            activeVariant={activeVariant}
            onChange={onVariantChange}
            optionClassName={getOptionStyle('size')}
          />
        </div>
      </div>
      {/* Other options mobile */}
      <div className={styles.optionsDivMobile}>
        {/* Frequency */}
        <ProductOption
          option={product.options.find((opt) =>
            opt.name.toLowerCase().includes('one-time')
          )}
          variants={product.variants}
          activeVariant={activeVariant}
          onChange={onVariantChange}
          isDropdown
        />

        {productCounter}

        {/* Grind */}
        <ProductOption
          option={product.options.find((opt) =>
            opt.name.toLowerCase().includes('grind')
          )}
          variants={product.variants}
          activeVariant={activeVariant}
          onChange={onVariantChange}
          isDropdown
        />

        <ProductAdd
          product={product}
          activeVariant={activeVariant}
          quantity={productQuantity}
          fixedOnMobile
        />
      </div>
    </section>
  )
}

export default ProductHero
