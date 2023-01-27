import cx from 'classnames'

import CustomImage from '@components/custom-image'
import CustomLink from '@components/common/custom-link'

import styles from './training-list-item.module.scss'

const getImageClassName = (category, index) => {
  if (category === 'Professional') {
    switch (index) {
      case 0:
        return styles.baristaImage
      case 1:
        return styles.latteArtImage
      case 2:
        return styles.sensoryImage
      default:
        return styles.itemImage
    }
  }
  return styles.itemImage
}

const getImageClassNameMobile = (category, index) => {
  if (category === 'Professional') {
    switch (index) {
      case 0:
        return styles.baristaImageMobile
      case 1:
        return styles.latteArtImageMobile
      case 2:
        return styles.sensoryImageMobile
      default:
        return styles.itemImage
    }
  }
  return styles.itemImage
}

function TrainingListItem({ item, category, index }) {
  return (
    <div className={styles.itemWrapper}>
      <CustomImage
        className={cx(
          styles.itemImage,
          getImageClassNameMobile(category, index)
        )}
        photo={item?.imageMobile}
      />
      <CustomImage
        className={cx(styles.itemImage, getImageClassName(category, index))}
        photo={item?.imageDesktop}
      />
      <h2 className={cx('h2', styles.itemName)}>{item.name}</h2>
      <div className={styles.itemDescAndBtnWrapper}>
        <p className={styles.itemDescription}>{item.description}</p>
        {item?.url && (
          <div>
            <CustomLink
              buttonWrapper={styles.itemButton}
              href={`/tasting-and-training/${item.url}`}
              title="Learn More"
              color="blue"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default TrainingListItem
