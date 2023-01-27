import CustomImage from '@components/custom-image'
import cx from 'classnames'
import React, { useState } from 'react'
import styles from './subscriptions-plan-display.module.scss'
import BlockContent from '@components/block-content'
import CustomCarousel from '@components/common/custom-carousel'
import {
  ProductAdd,
  ProductOption,
  ProductQuantityCounter,
} from '@components/product'
import SubscriptionsGiftDisplay from './subscriptions-gift-display'

const optionSortWeights = {
  Size: -1,
  'Available Grind': 1,
}

const borderStyles = [styles.grayBorder, styles.redBorder, styles.blueBorder]

const SubscriptionsPlanDisplay = ({ data = {}, subscriptionChoice }) => {
  const { backgroundImage, subscriptionPlans } = data

  const [activeVariants, setActiveVariants] = useState(
    subscriptionPlans.map((plan) => plan.planProduct.variants[0] || null)
  )
  const [productQuantity, setProductQuantity] = useState(
    new Array(subscriptionPlans.length).fill(1)
  )

  const productCounter = (idx) => (
    <ProductQuantityCounter
      activeVariant={activeVariants[idx]}
      onChange={(q) => {
        const quantities = Object.assign([], productQuantity)
        quantities[idx] = q
        setProductQuantity(quantities)
      }}
    />
  )

  const changeActiveVariant = (idx, variantID) => {
    const actives = Object.assign([], activeVariants)
    const newVariant = subscriptionPlans[idx].planProduct.variants.find(
      (v) => v.id === variantID
    )
    if (!newVariant) return

    actives[idx] = newVariant
    setActiveVariants(actives)
  }

  const PlanComponent = (plan, idx) => {
    if (!plan.planProduct) return null

    const titleSplit = plan.planProduct.title.split('-')[0].split(' ')

    return (
      <div key={idx} className={styles.productPlan}>
        <div className={styles.productTitleContainer}>
          <div className={styles.productTitleBG} />
          <div
            className={cx(styles.productTitleBorder, borderStyles[idx % 3])}
          />
          <div className={styles.productTitleText}>
            <h2>{titleSplit[0]}</h2>
            {titleSplit.length > 1 && <h2>{titleSplit.slice(1).join(' ')}</h2>}
          </div>
        </div>

        <div className={styles.productContentSpacing}>
          <BlockContent
            blocks={plan.planProduct.description}
            className={styles.productDescription}
          />
          <button className={styles.readMoreButton}>Read More</button>

          <div className={styles.productOptionsContainer}>
            {plan.planProduct.options
              .sort(
                (a, b) =>
                  optionSortWeights[a.name] ||
                  0 - optionSortWeights[b.name] ||
                  0
              )
              .map((opt, idx_opt) => {
                const ProdOptionElement = (
                  <ProductOption
                    key={idx_opt}
                    option={opt}
                    variants={plan.planProduct.variants}
                    activeVariant={activeVariants[idx]}
                    onChange={(newID) => changeActiveVariant(idx, newID)}
                  />
                )
                if (!opt.name.includes('Grind')) {
                  return ProdOptionElement
                } else {
                  return (
                    <div key={idx_opt} className={styles.doubleOptionDiv}>
                      {productCounter(idx)}
                      {ProdOptionElement}
                    </div>
                  )
                }
              })}
            <ProductAdd
              product={subscriptionPlans[idx]}
              activeVariant={activeVariants[idx]}
              quantity={productQuantity[idx]}
            />
          </div>
        </div>
        <div className={styles.productOptionsContainerMobile}>
          {/* Size option */}
          <ProductOption
            option={plan.planProduct.options.find((opt) =>
              opt.name.toLowerCase().includes('size')
            )}
            optionClassName={styles.sizeOption}
            variants={plan.planProduct.variants}
            activeVariant={activeVariants[idx]}
            onChange={(newID) => changeActiveVariant(idx, newID)}
          />

          {/* Frequency option */}
          <ProductOption
            option={plan.planProduct.options.find(
              (opt) =>
                opt.name.toLowerCase().includes('frequency') ||
                opt.name.toLowerCase().includes('one-time')
            )}
            optionClassName={styles.frequencyOption}
            variants={plan.planProduct.variants}
            activeVariant={activeVariants[idx]}
            onChange={(newID) => changeActiveVariant(idx, newID)}
          />

          {/* Product counter */}
          {productCounter(idx)}

          {/* Grind option */}
          <ProductOption
            option={plan.planProduct.options.find((opt) =>
              opt.name.toLowerCase().includes('grind')
            )}
            optionClassName={styles.grindOption}
            variants={plan.planProduct.variants}
            activeVariant={activeVariants[idx]}
            onChange={(newID) => changeActiveVariant(idx, newID)}
          />

          <ProductAdd
            product={subscriptionPlans[idx]}
            activeVariant={activeVariants[idx]}
            quantity={productQuantity[idx]}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.planMainDiv}>
      <CustomImage photo={backgroundImage} className={styles.bgImage} />

      {subscriptionChoice === 1 && (
        <div className={styles.subscriptionMessageContainer}>
          <p className={styles.subscriptionMessage}>
            Select the coffee type &amp; gift subscription length. Your gift is
            sent every month and delivered with free shipping!
          </p>
        </div>
      )}

      {subscriptionChoice !== 1 ? (
        <>
          <div className={styles.planContainer}>
            {subscriptionPlans.map(PlanComponent)}
          </div>
          <CustomCarousel
            wrapperClass={styles.carouselMobile}
            dotWrapperClass={styles.carouselDotWrapper}
            dotColor={'orange'}
          >
            {subscriptionPlans.map((plan, idx) => (
              <div key={'main' + idx}>{PlanComponent(plan, idx)}</div>
            ))}
          </CustomCarousel>
        </>
      ) : (
        <>
          <div className={styles.planContainer}>
            {subscriptionPlans.map((plan, idx_plan) => (
              <SubscriptionsGiftDisplay
                key={idx_plan}
                idx={idx_plan}
                plan={plan}
              />
            ))}
          </div>
          <CustomCarousel
            wrapperClass={styles.carouselMobile}
            dotWrapperClass={styles.carouselDotWrapper}
            dotColor={'orange'}
          >
            {subscriptionPlans.map((plan, idx_plan) => (
              <SubscriptionsGiftDisplay
                key={idx_plan}
                idx={idx_plan}
                plan={plan}
              />
            ))}
          </CustomCarousel>
        </>
      )}
    </div>
  )
}

export default SubscriptionsPlanDisplay
