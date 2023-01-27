import React from 'react'
import cx from 'classnames'

import CustomImage from '@components/custom-image'
import styles from './our-story-notes-section.module.scss'

const OurStoryNotesSection = ({ data = {} }) => {
  const {
    title,
    content,
    leftNoteTitle,
    leftNotes,
    firstPolaroidImg,
    secondPolaroidImg,
  } = data

  return (
    <div className={styles.sectionContainer}>
      {/* Left Notes */}
      <img
        src="/images/our-story-page/note-paper.png"
        alt=""
        className={cx(styles.noteImage, styles.backgroundNoteImage)}
      />
      <img
        src="/images/our-story-page/note-paper.png"
        alt=""
        className={cx(styles.noteImage, styles.foregroundNoteImage)}
      />
      <img
        src="/images/our-story-page/pencil.png"
        alt=""
        className={styles.pencilImage}
      />
      <div className={styles.notesTextContainer}>
        <h2 className={styles.notesTitle}>{leftNoteTitle}</h2>
        {leftNotes.map((noteTxt, idx) => (
          <p key={idx}>{'- ' + noteTxt}</p>
        ))}
      </div>

      {/* Right Polaroids */}
      <CustomImage
        photo={secondPolaroidImg}
        className={cx(styles.polaroidImage, styles.secondPolaroidImage)}
      />
      <CustomImage
        photo={firstPolaroidImg}
        className={cx(styles.polaroidImage, styles.firstPolaroidImage)}
      />

      {/* Right Book Image */}
      <img
        src="/images/our-story-page/book-with-images.png"
        alt=""
        className={styles.bookImage}
      />

      <h2 className={styles.mainTitle}>{title}</h2>
      <div className={styles.textContentContainer}>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default OurStoryNotesSection
