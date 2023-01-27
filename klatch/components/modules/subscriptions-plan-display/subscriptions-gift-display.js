import React, { useState } from 'react'
import cx from 'classnames'
import styles from './subscriptions-plan-display.module.scss'
import BlockContent from '@components/block-content'
import {
  ProductAdd,
  ProductOption,
  ProductQuantityCounter,
} from '@components/product'

const borderStyles = [styles.grayBorder, styles.redBorder, styles.blueBorder]

const SubscriptionsGiftDisplay = ({ plan, idx }) => {
  if (!plan.planGifts || !plan.planGifts?.length) return null

  const giftPlan = plan.planGifts[0].giftPlanProduct
  const titleSplit = plan.planProduct.title.split('-')[0].split(' ')

  const [productQuantity, setProductQuantity] = useState(0)
  const [activeVariants, setActiveVariants] = useState(
    plan.planGifts.map((gift) => gift.giftPlanProduct.variants[0] || gift)
  )

  const changeActiveVariant = (idx, variantID) => {
    const actives = Object.assign([], activeVariants)
    const newVariant = plan.planGifts[idx].giftPlanProduct.variants.find(
      (v) => v.id === variantID
    )
    if (!newVariant) return

    setActiveVariants(
      plan.planGifts.map((p) => {
        const switchVariant = p.giftPlanProduct.variants.find(
          (v) =>
            v.options.length > 0 &&
            v.options[0].value === newVariant.options[0].value
        )
        if (!switchVariant) return p
        return switchVariant
      })
    )
  }

  return (
    <div key={idx} className={styles.productPlan}>
      <div className={styles.productTitleContainer}>
        <div className={styles.productTitleBG} />
        <div className={cx(styles.productTitleBorder, borderStyles[idx % 3])} />
        <div className={styles.productTitleText}>
          <h2>{titleSplit[0]}</h2>
          {titleSplit.length > 1 && <h2>{titleSplit.slice(1).join(' ')}</h2>}
        </div>
      </div>

      <div className={styles.productContentSpacing}>
        <BlockContent
          blocks={plan.giftDescription || plan.planProduct.description}
          className={cx(styles.productDescription, styles.giftDescription)}
        />

        <div className={styles.giftOptionsContainer}>
          <div className={styles.doubleOptionDiv}>
            <ProductQuantityCounter
              activeVariant={giftPlan}
              onChange={(q) => setProductQuantity(q)}
            />
            <ProductOption
              option={giftPlan.options.find((opt) =>
                opt.name.includes('Grind')
              )}
              variants={giftPlan.variants}
              optionClassName={styles.grindOption}
              activeVariant={activeVariants[0]}
              onChange={(newID) => changeActiveVariant(0, newID)}
            />
          </div>
          {plan.planGifts.map((gift, idx_gift) => (
            <ProductAdd
              key={idx_gift}
              product={gift.giftPlanProduct}
              activeVariant={activeVariants[idx_gift]}
              quantity={productQuantity}
              customText={`${gift.buttonTitle}`}
              showCustomTextNoStock
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsGiftDisplay
