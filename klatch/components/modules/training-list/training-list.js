import { useState } from 'react'
import cx from 'classnames'

import BlockContent from '@components/block-content'
import CustomCarousel from '@components/common/custom-carousel'

import { useWindowSizeAdjustments } from 'util/window-resize'

import TrainingListItem from './training-list-item'

import styles from './training-list.module.scss'

function TrainingList({ data = {} }) {
  const { heading, paragraphMobile, paragraphDesktop, categoryFilters, items } =
    data

  const [trainingFilter, setTrainingFilter] = useState(0)
  const { windowWidth } = useWindowSizeAdjustments()

  const currentItems = items
    ?.filter((item) => item.category === categoryFilters[trainingFilter].title)
    ?.slice(0, 3)

  const noItems = currentItems.length === 0

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{heading}</h1>
          <BlockContent
            className={styles.paragraphMobile}
            blocks={paragraphMobile}
          />
          <BlockContent
            className={styles.paragraphDesktop}
            blocks={paragraphDesktop}
          />
          <div className={styles.choiceBlockContainer}>
            {categoryFilters?.map((category, index) => (
              <div
                key={index}
                className={cx(styles.choiceBlock, {
                  [styles.active]: trainingFilter === index,
                })}
                onClick={() => setTrainingFilter(index)}
              >
                <p>{category.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.itemSection}>
        <div className={styles.itemSectionContainer}>
          {noItems ? (
            <div className={styles.noItems}>
              <p>These items are coming soon!</p>
            </div>
          ) : windowWidth >= 1024 ? (
            <div className={styles.itemGrid}>
              {currentItems?.map((item, index) => (
                <TrainingListItem
                  item={item}
                  category={categoryFilters[trainingFilter].title}
                  index={index}
                  key={index}
                />
              ))}
            </div>
          ) : (
            <CustomCarousel dotWrapperClass={styles.itemCarouselDotWrapper}>
              {currentItems?.map((item, index) => (
                <TrainingListItem
                  item={item}
                  category={categoryFilters[trainingFilter].title}
                  index={index}
                  key={index}
                />
              ))}
            </CustomCarousel>
          )}
        </div>
        <img
          className={styles.coffeeBeansImage}
          src="/images/no-to-delete/tasting-and-training/coffee-beans-group.png"
        />
      </section>
    </>
  )
}

export default TrainingList
