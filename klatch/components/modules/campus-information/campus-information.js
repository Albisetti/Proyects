import CustomImage from '@components/custom-image'

import styles from './campus-information.module.scss'

function CampusInformation({ data = {} }) {
  const { title, subtitle, address, rightImage } = data

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <p className={styles.address}>{address}</p>
      </div>
      {rightImage && (
        <CustomImage photo={rightImage} className={styles.rightImage} />
      )}
    </section>
  )
}

export default CampusInformation
