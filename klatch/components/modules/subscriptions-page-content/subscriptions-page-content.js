import React, { useState } from 'react'
import cx from 'classnames'
import CustomImage from '@components/custom-image'
import styles from './subscriptions-page-content.module.scss'
import SubscriptionsPlanDisplay from '../subscriptions-plan-display/subscriptions-plan-display'

const subscriptionChoices = [
  'Club Subscriptions',
  'Gift Subscriptions',
  'Manage Subscriptions',
]

const SubscriptionsPageContent = ({ data = {} }) => {
  const { subtitle, title, leftImage, rightImage, subscriptionsDisplay } = data

  const [subChoice, setSubChoice] = useState(0)

  return (
    <>
      <div className={styles.heroContainer}>
        <div className={styles.imagesContainer}>
          <CustomImage photo={leftImage} className={styles.leftImage} />
          <CustomImage photo={rightImage} className={styles.rightImage} />
        </div>
        <h1>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.subscriptionsChoiceDiv}>
          {subscriptionChoices.map((sub, idx) => (
            <div
              key={idx}
              className={cx(styles.choiceBlock, {
                [styles.active]: subChoice === idx,
              })}
              onClick={() => setSubChoice(idx)}
            >
              <p>{sub}</p>
            </div>
          ))}
        </div>
      </div>
      {subscriptionsDisplay && (
        <SubscriptionsPlanDisplay
          data={subscriptionsDisplay}
          subscriptionChoice={subChoice}
        />
      )}
    </>
  )
}

export default SubscriptionsPageContent
