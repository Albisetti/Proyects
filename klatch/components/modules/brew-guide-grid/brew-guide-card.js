import { useState } from 'react'
import cx from 'classnames'
import Link from 'next/link'

import PolaroidImage from '../polaroid-image/polaroid-image'
import styles from './brew-guide-card.module.scss'

function BrewGuideCard({ brewGuide, decorationFirst, decorationLast }) {
  const { name, slug, image } = brewGuide

  const [hover, setHover] = useState(false)

  return (
    <div className={styles.cardWrapper}>
      <Link href={`/brew-guides/${slug?.current}`} passHref>
        <a title={name}>
          <PolaroidImage
            image={image}
            wrapperClass={cx(styles.imageWrapper, {
              [styles.hasMouseOver]: hover,
            })}
            imageWrapperClass={styles.image}
            imageClass={styles.actualImage}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          />
          <p className={cx('condensed', styles.cardTitle)}>{name}</p>
        </a>
      </Link>

      {decorationFirst && (
        <div className={styles.decorationFirst}>
          <span className="h2">{decorationFirst?.text}</span>
          <img src={decorationFirst?.imgSrc} />
        </div>
      )}
      {decorationLast && (
        <div className={styles.decorationLast}>
          <img src={decorationLast?.imgSrc} />
          <span className="h2">{decorationLast?.text}</span>
        </div>
      )}
    </div>
  )
}

export default BrewGuideCard
