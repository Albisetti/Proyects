import CustomLink from '@components/common/custom-link'
import PolaroidImage from '@components/modules/polaroid-image/polaroid-image'

import styles from './instructor-card.module.scss'
import imageStyles from './instructor-images.module.scss'

const getColorClassName = (color) => {
  switch (color) {
    case 'blue':
      return imageStyles.cardBlue
    case 'green':
      return imageStyles.cardGreen
    case 'orange':
      return imageStyles.cardOrange
    case 'red':
      return imageStyles.cardRed
  }
}

const getColorImageSrc = (color) => {
  switch (color) {
    case 'blue':
      return '/images/no-to-delete/card-blue.png'
    case 'green':
      return '/images/no-to-delete/card-green.png'
    case 'orange':
      return '/images/no-to-delete/card-orange.png'
    case 'red':
      return '/images/no-to-delete/card-red.png'
  }
}

function InstructorCard({ instructor }) {
  const { name, description, link, color, image } = instructor

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={getColorClassName(color)}>
          <img
            className={imageStyles.cardColor}
            src={getColorImageSrc(color)}
          />
          <div className={imageStyles.polaroid}>
            <PolaroidImage
              text={name}
              image={image}
              wrapperClass={styles.imageWrapper}
              imageWrapperClass={styles.image}
              imageClass={styles.actualImage}
              textClass={styles.imageCaption}
            />
          </div>
          <img
            className={imageStyles.paperclip}
            src="/images/no-to-delete/paperclip.png"
          />
        </div>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.description}>{description}</p>
        {link && (
          <div>
            <CustomLink
              title={link?.title}
              buttonWrapper={styles.learnMoreLink}
              href={link?.target === '_self' ? `/${link?.url}` : link?.url}
              color="blue"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorCard
