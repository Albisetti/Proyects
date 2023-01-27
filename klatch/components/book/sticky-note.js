import React from 'react'
import styles from './sticky-note.module.scss'
import cx from 'classnames'
import { useWindowSizeAdjustments } from 'util/window-resize'
import CustomCarousel from '@components/common/custom-carousel'

const StickyNotes = ({ notes }) => {
  const { windowWidth } = useWindowSizeAdjustments()
  const handleRoast = (roast) => {
    let diamonds = { filled: 0, unFilled: 0 }
    if (roast === 'medium') {
      diamonds.filled = 2
      diamonds.unFilled = 1
    } else if (roast === 'light') {
      diamonds.filled = 1
      diamonds.unFilled = 2
    } else if (roast === 'strong') {
      diamonds.filled = 3
      diamonds.unFilled = 0
    }

    let filled = Array.from(Array(diamonds.filled))
    let unFilled = Array.from(Array(diamonds.unFilled))

    return (
      <>
        {filled?.map((item,index) => {
          return (
            <div key={index}>
            <img
              className={styles.diamondFilled}
              src="/images/no-to-delete/sticky-notes/diamondFilled.svg"
            />
            </div>
          )
        })}
        {unFilled?.map((item,index) => {
          return (
            <div key={index}>
            <img
              key={index}
              className={styles.diamond}
              src="/images/no-to-delete/sticky-notes/diamond.svg"
            />
            </div>
          )
        })}
      </>
    )
  }

  const handleNotes = (note) => {
    switch (note?.type) {
      case 'flavor':
        return (
          <div className={styles.content}>
            <img
              className={styles.propLeft}
              src="/images/no-to-delete/sticky-notes/propLeft.svg"
            />
            <img
              className={styles.propRight}
              src="/images/no-to-delete/sticky-notes/propRight.svg"
            />
            <div className={styles.text1}>
              <p className={styles.title}>{note?.title}</p>
              <p className={styles.text}>{note?.description}</p>
            </div>
            {note?.process && (
              <div className={styles.text2}>
                <p className={styles.title}>Process</p>
                <p className={styles.text}>{note?.process}</p>
              </div>
            )}
          </div>
        )
      case 'general':
        return (
          <div className={styles.generalContent}>
            <img
              className={styles.star}
              src="/images/no-to-delete/sticky-notes/star.svg"
            />
            <img
              className={styles.heart}
              src="/images/no-to-delete/sticky-notes/heart.svg"
            />
            <div className={styles.generalText}>
              <p className={styles.title}>{note?.title}</p>
              <p className={styles.text}>{note?.description}</p>
            </div>
          </div>
        )
      case 'roast':
        let roast = note.roast
        return (
          <div className={styles.roastContent}>
            <div className={styles.roastText}>
              <p className={styles.title}>{note?.title}</p>
              <p className={styles.text}>{note?.roast}</p>
              <div className={styles.diamondWrapper}>{handleRoast(roast)}</div>
            </div>
          </div>
        )
      default:
        break
    }
  }

  const renderNote = (note, index) => {
    return (
      <div
        key={index}
        className={cx(styles.wrapper, {
          [styles.wrapperFirst]: index % 3 === 0,
          [styles.wrapperSecond]: index % 3 === 1,
          [styles.wrapperThird]: index % 3 === 2,
        })}
      >
        <div
          className={cx(
            styles.stickyNotesWrapper,
            {
              [styles.notesBlue]: note?.color === 'blue',
              [styles.notesGreen]: note?.color === 'green',
              [styles.notesOrange]: note?.color === 'orange',
            },
            {
              [styles.notesBlue]: note?.color === 'blue',
              [styles.notesGreen]: note?.color === 'green',
              [styles.notesOrange]: note?.color === 'orange',
            },
            {
              [styles.firstNote]: index % 3 === 0,
              [styles.secondNote]: index % 3 === 1,
              [styles.thirdNote]: index % 3 === 2,
            }
          )}
        >
          <div className={styles.notesContentWrapper}>{handleNotes(note)}</div>
        </div>
      </div>
    )
  }

  return windowWidth > 1024 ? (
    notes?.map((note, index) => {
      return <div key={index}>{renderNote(note, index)}</div>
    })
  ) : (
    <CustomCarousel dotColor={'orange'} dotBorders={true}>
      {notes?.map((note, index) => {
        return <div key={index}>{renderNote(note, index)}</div>
      })}
    </CustomCarousel>
  )
}

export default StickyNotes
