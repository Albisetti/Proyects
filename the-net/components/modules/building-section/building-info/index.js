import React, { useContext } from 'react'

import styles from './styles.module.scss'
import cx from 'classnames'

import { MenuContext } from '@context/menuContext'

const BuildingInfo = ({ data = {} }) => {
  const { leftSection, rightSection } = data
  const { document, items, title, background } = leftSection
  const { designFeatures, sustainability } = rightSection

  const { menus } = useContext(MenuContext)

  return (
    <div
      className={cx(
        'fixed top-0 transition-all overflow-x-hidden duration-[1.75s] opacity-0 invisible pointer-events-none',
        {
          '!opacity-100 !visible !pointer-events-auto': !!menus.find(
            (item) => item === 'building-info'
          ),
        }
      )}
    >
      <div className={styles.buildingInfoContainer}>
        <div
          className={styles.leftSectionContainer}
          style={{ backgroundImage: `url(${background})` }}
        >
          <div
            className={cx(
              styles.leftSectionContent,
              'transition-transform duration-[1.75s] translate-y-[40px]',
              {
                '!translate-y-0': !!menus.find(
                  (item) => item === 'building-info'
                ),
              }
            )}
          >
            <h3 className={styles.featuresTitle}>{title}</h3>
            <ul className={styles.featuresUl}>
              {items.map((item, key) => (
                <li key={key} className={styles.featuresItems}>
                  <p className={styles.featuresItemsText}>{item}</p>
                </li>
              ))}
            </ul>
            <a className={styles.downloadButton} href={document} download>
              <svg
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.3 0.3H9.09189L13.7 5.52252V16.8818H0.3V0.3Z"
                  stroke="#DFC087"
                  strokeWidth="0.6"
                />
                <path
                  d="M9.22754 0.318359V5.40927H13.6821"
                  stroke="#DFC087"
                  strokeWidth="0.6"
                />
              </svg>

              <p className={styles.downloadButtonText}>download fact sheet</p>
            </a>
          </div>
        </div>

        <div className={styles.rightSectionContainer}>
          <div
            className={cx(
              styles.rightSectionContent,
              'transition-transform duration-[1.75s] translate-y-[40px]',
              {
                '!translate-y-0': !!menus.find(
                  (item) => item === 'building-info'
                ),
              }
            )}
          >
            <div>
              <h3 className={styles.rightSectionTitle}>
                {designFeatures.title}
              </h3>
              <div className={styles.designFeatures}>
                {designFeatures.features.map((feature, key) => (
                  <div key={key} className={styles.designFeaturesItem}>
                    <h3 className={styles.itemNumber}>
                      {feature.number}
                      <span className={styles.itemUnit}>{feature.unit}</span>
                    </h3>

                    <p className={styles.itemSubtitle}>{feature.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.sustainability}>
              <h3 className={styles.rightSectionTitle}>
                {sustainability.title}
              </h3>
              <p className={styles.subtitle}> {sustainability.subtitle}</p>
              <div className={styles.images}>
                {sustainability.images.map((image, key) => (
                  <div key={key} className={styles.imageBox}>
                    <div className={styles.image}>
                      <img src={image.image} />
                    </div>
                    <p className={styles.epigraph}>{image.epigraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildingInfo
