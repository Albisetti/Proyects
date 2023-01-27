import React, { useRef, useState } from 'react'
import cx from 'classnames'
import Slider from 'react-slick'
import styles from './tags-slider.module.scss'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const ReviewContent = (
  { reviewerName, rating, reviewTitle, reviewText, previewText },
  isModal,
  onReadMore
) => (
  <div
    className={cx(styles.textContainer, {
      [styles.textContainerNormalSpacing]: !isModal,
    })}
  >
    <h2 className={styles.reviewerTitle}>{reviewerName}</h2>
    {!!rating && (
      <div className={styles.reviewStarContainer}>
        {new Array(rating).fill(0).map((_, idxStar) => (
          <img
            key={idxStar}
            className={styles.reviewStar}
            src="/images/no-to-delete/review-star.svg"
            alt="*"
          />
        ))}
      </div>
    )}
    <p className="font-bold">{reviewTitle}</p>
    <p className={!isModal ? styles.reviewPreviewText : ''}>
      {!isModal ? previewText || reviewText : reviewText}
    </p>
    {!isModal && (
      <p className={styles.readMoreLink} onClick={onReadMore}>
        Read more.
      </p>
    )}
  </div>
)

const ReviewModal = (tagItem, isOpen, modalID, onClose) => (
  <div
    className={cx(styles.reviewModal, { [styles.reviewModalVisible]: isOpen })}
    onClick={onClose}
  >
    <div
      className={cx(styles.reviewModalContainer, {
        [styles.bgModalRed]: modalID % 3 === 0,
        [styles.bgModalOrange]: modalID % 3 === 1,
        [styles.bgModalBlue]: modalID % 3 === 2,
        [styles.reviewModalContainerVisible]: isOpen,
      })}
    >
      <div className={styles.modalCloseButton} onClick={onClose}>
        X
      </div>
      {ReviewContent(tagItem, true)}
    </div>
  </div>
)

const TagsSlider = ({ data = {} }) => {
  const { tags } = data

  const [reviewModalOpen, setReviewModalOpen] = useState(-1)
  const [currentSlide, setCurrentSlide] = useState(tags?.length > 2 ? 1 : 0)

  const sliderSettings = {
    beforeChange: (_prev, next) => setCurrentSlide(next),
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    variableWidth: true,
    centerMode: true,
    initialSlide: tags?.length > 2 ? 1 : 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          infinite: true,
          variableWidth: false,
          centerMode: false,
        },
      },
    ],
  }

  const sliderRef = useRef(null)

  return (
    <div className="relative">
      {tags.map((tag, idx) => (
        <div key={idx}>
          {ReviewModal(tag, reviewModalOpen === idx, idx, () =>
            setReviewModalOpen(-1)
          )}
        </div>
      ))}
      <Slider ref={sliderRef} {...sliderSettings}>
        {tags.map((tag, idx) => (
          <div key={idx}>
            <div
              className={cx(styles.mainTagDiv, {
                [styles.mainHidden]: currentSlide !== idx,
              })}
            >
              <img
                src={
                  idx % 3 === 0
                    ? '/images/no-to-delete/review-tag-red.png'
                    : idx % 3 === 1
                    ? '/images/no-to-delete/review-tag-orange.png'
                    : '/images/no-to-delete/review-tag-blue.png'
                }
                className={styles.tagImage}
              />
              {ReviewContent(tag, false, () => setReviewModalOpen(idx))}
            </div>
          </div>
        ))}
      </Slider>
      <div
        className={styles.sliderButtonsContainer}
        onClick={() => sliderRef.current?.slickNext()}
      >
        <p className={styles.readMoreButton}>Read More Reviews</p>
        <img
          src="/images/no-to-delete/product-slider-arrowright.png"
          alt=">"
          className={styles.arrowImg}
        />
      </div>
    </div>
  )
}

export default TagsSlider
