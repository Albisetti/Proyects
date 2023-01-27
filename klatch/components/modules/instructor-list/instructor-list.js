import CustomCarousel from '@components/common/custom-carousel'
import InstructorCard from './instructor-card'

import { useWindowSizeAdjustments } from 'util/window-resize'

import styles from './instructor-list.module.scss'

function InstructorList({ data = {} }) {
  const { heading, paragraph, instructors } = data

  const { windowWidth } = useWindowSizeAdjustments()

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.paragraph}>{paragraph}</p>

        {windowWidth >= 1024 ? (
          <div className={styles.instructorGrid}>
            {instructors?.map((instructor, index) => (
              <InstructorCard instructor={instructor} key={index} />
            ))}
          </div>
        ) : (
          <CustomCarousel
            wrapperClass={styles.instructorCarousel}
            dotWrapperClass={styles.instructorCarouselDotWrapper}
            dotBorders={true}
          >
            {instructors?.map((instructor, index) => (
              <InstructorCard instructor={instructor} key={index} />
            ))}
          </CustomCarousel>
        )}
      </div>
      <img
        className={styles.cherries}
        src="/images/no-to-delete/brew-guides/cherries-1.png"
      />
    </section>
  )
}

export default InstructorList
