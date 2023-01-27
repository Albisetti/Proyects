import React, { useState } from 'react'
import CustomLink from '@components/common/custom-link'
import cx from 'classnames'

import styles from './menu-page-content.module.scss'
import CustomImage from '@components/custom-image'

const CoffeeProduct = (coffee, idx) => (
  <div key={idx} className={styles.coffeeProduct}>
    <div className={styles.coffeeImageContainer}>
      <div className={styles.centerDiv}>
        {coffee.image ? (
          <CustomImage photo={coffee.image} className={styles.coffeeImage} />
        ) : (
          <img
            src="/images/menu-page/default-product-klatch-logo.svg"
            alt=""
            className={styles.defaultCoffeeImage}
          />
        )}
      </div>
    </div>
    <p className={styles.coffeeName}>{coffee.name}</p>
  </div>
)

const MenuPageContent = ({ data = {} }) => {
  const {
    title,
    leftButtonTitle,
    leftButtonLink,
    rightButtonTitle,
    rightButtonLink,
    categories,
    sampleCoffees,
  } = data

  const allMenuItems = [].concat(
    ...sampleCoffees.map((group) =>
      group.items.map((it) => {
        return { ...it, filters: group.filters }
      })
    )
  )

  const [selectedCategory, setSelectedCategory] = useState(0)
  const [selectedSubCategory, setSelectedSubCategory] = useState(0)

  const coffeeDisplayTitle = categories[selectedCategory].subCategories?.length
    ? categories[selectedCategory].subCategories[selectedSubCategory]?.title
    : categories[selectedCategory].name

  const filterMatchesSelected = (filterToMatch) => {
    const current = categories[selectedCategory]
    return current.subCategories?.length
      ? current.subCategories[selectedSubCategory].filter?.slug ===
          filterToMatch
      : current?.filter?.slug === filterToMatch
  }

  return (
    <div className={styles.contentWrapper}>
      <img
        src="/images/menu-page/menu-page-bg1.png"
        alt=""
        className={styles.bgImageLeft}
      />
      <img
        src="/images/menu-page/menu-page-bg2.png"
        alt=""
        className={styles.bgImageRight}
      />

      <div className={styles.mobilePadding}>
        <h1 className={styles.mainTitle}>{title}</h1>

        <div className={styles.buttonsContainer}>
          {!!leftButtonTitle && !!leftButtonLink && (
            <CustomLink
              href={leftButtonLink}
              title={leftButtonTitle}
              color="orange"
            />
          )}
          {!!rightButtonTitle && !!rightButtonLink && (
            <CustomLink
              href={rightButtonLink}
              title={rightButtonTitle}
              color="orange"
            />
          )}
        </div>

        <div className={styles.categoriesContainer}>
          <p className={styles.categoryTitle}>Sort by Category</p>
          <div className={styles.categoryBlocks}>
            {categories.map((c, idx) => (
              <div
                key={idx}
                className={cx(styles.categoryBlock, {
                  [styles.selected]: idx === selectedCategory,
                })}
                onClick={() => {
                  setSelectedCategory(idx)
                  setSelectedSubCategory(0)
                }}
              >
                <p>{c.name}</p>
              </div>
            ))}
          </div>
          {!!categories[selectedCategory]?.subCategories && (
            <div className={styles.subCategoriesContainer}>
              {categories[selectedCategory].subCategories
                .filter((subc) => !!subc?.title)
                .map((subc, idx) => (
                  <p
                    key={idx}
                    className={cx(styles.subCategory, {
                      [styles.selected]: idx === selectedSubCategory,
                    })}
                    onClick={() => setSelectedSubCategory(idx)}
                  >
                    {subc.title}
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.coffeesDisplay}>
        <h2 className={styles.coffeeDisplayTitle}>{coffeeDisplayTitle}</h2>

        <div className={styles.coffeeProductsContainer}>
          {allMenuItems
            .filter(
              (c) =>
                !c?.filters?.length ||
                (c?.filters?.length > 0 &&
                  c.filters.some((f) => filterMatchesSelected(f.slug)))
            )
            .map(CoffeeProduct)}
        </div>
      </div>
    </div>
  )
}

export default MenuPageContent
