import React, { useContext, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import BlockContent from '@components/block-content'

import cx from 'classnames'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// import required modules
import SwiperCore, { Navigation, Pagination } from 'swiper'
import { MenuContext } from '@context/menuContext'

SwiperCore.use([Navigation])

const Gallery = ({ data = {}, topSpacing = true, hasDescription = true }) => {
  const { menuOpen } = useContext(MenuContext)
  const { images } = data

  const [swiper, setSwiper] = useState(null)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  useEffect(() => {
    if (menuOpen?.split('/')[0] === 'amenities-menu') {
      swiper?.slideToLoop(parseInt(menuOpen?.split('/')[1]) || 0, 0)
    } else if (!menuOpen) {
      setSwiper(undefined)
    }
  }, [menuOpen])
  const [totalSlides, setTotalSlides] = useState(images?.length)

  return (
    <div
      className={cx(styles.sectionContainer, {
        [styles.sectionContainerSpacing]: topSpacing,
      })}
    >
      {hasDescription && (
        <div className={cx(styles.descriptionContainer, 'hidden sm:block')}>
          {images
            ? images.map((imageWithTitle, index) => (
                <BlockContent
                  key={index}
                  className={cx(styles.description, {
                    [styles.descriptionHidden]: currentSlideIndex !== index + 1,
                  })}
                  blocks={imageWithTitle?.description}
                />
              ))
            : null}
        </div>
      )}
      <div className={styles.container}>
        <div id="swiper-container" className={styles.swiper}>
          <Swiper
            initialSlide={parseInt(menuOpen?.split('/')[1]) || 0}
            slidesPerView={1.2}
            modules={[Navigation, Pagination]}
            className={styles.swiperSlide}
            allowTouchMove={false}
            loop={true}
            allowSlidePrev={false}
            speed={2000}
            navigation={{
              nextEl: '.new-swiper-button-next',
              prevEl: '.new-swiper-button-prev',
            }}
            onBeforeInit={(swiper) => {
              setTotalSlides(images.length)
            }}
            onSwiper={(swiper) => {
              setSwiper(swiper)
              swiper?.slides.forEach((slide, index) => {
                if (index === swiper?.activeIndex) {
                  slide.firstElementChild.classList.add('duration-[100ms]')
                  slide.firstElementChild.classList.add(styles.swiperImage)
                } else {
                  slide.firstElementChild.classList.add('duration-[100ms]')
                  slide.firstElementChild.classList.add(styles.swiperImageNext)
                }
              })
              swiper?.slides.forEach((slide, index) => {
                if (
                  index === swiper?.activeIndex ||
                  index + images.length === swiper?.activeIndex
                ) {
                  slide.firstElementChild.classList.add(styles.swiperImage)
                  slide.firstElementChild.classList.remove(
                    styles.swiperImageNext
                  )
                } else {
                  slide.firstElementChild.classList.add(styles.swiperImageNext)
                  slide.firstElementChild.classList.remove(styles.swiperImage)

                  if (
                    slide.firstElementChild.firstElementChild.nodeName === 'DIV'
                  ) {
                    slide.firstElementChild.firstElementChild.className =
                      styles.descriptionHidden
                  }
                }
              })
            }}
            onSlideChangeTransitionStart={(swiper) => {
              setCurrentSlideIndex(swiper?.realIndex + 1)
              swiper?.slides.forEach((slide, index) => {
                if (
                  index === swiper?.activeIndex ||
                  index + images.length === swiper?.activeIndex
                ) {
                  slide.firstElementChild.classList.add(styles.swiperImage)
                  slide.firstElementChild.classList.remove(
                    styles.swiperImageNext,
                    'duration-[100ms]'
                  )
                } else {
                  slide.firstElementChild.classList.add(styles.swiperImageNext)
                  slide.firstElementChild.classList.remove(
                    styles.swiperImage,
                    'duration-[100ms]'
                  )

                  if (
                    slide.firstElementChild.firstElementChild.nodeName === 'DIV'
                  ) {
                    slide.firstElementChild.firstElementChild.className =
                      styles.descriptionHidden
                  }
                }
                setTimeout(() => {
                  slide.firstElementChild.classList.add('duration-[2000ms]')
                }, 110)
              })
            }}
            onSlideChangeTransitionEnd={(swiper) => {
              swiper?.slides.forEach((slide, index) => {
                if (index === swiper?.activeIndex) {
                  if (
                    slide.firstElementChild.firstElementChild.nodeName === 'DIV'
                  ) {
                    slide.firstElementChild.firstElementChild.className =
                      styles.description
                  }
                }
              })
            }}
          >
            {images
              ? images.map((imageWithTitle, idx) => {
                  return (
                    <SwiperSlide key={idx} className="sm:flex">
                      <div className="h-full">
                        <h3 className={styles.galleryTitle}>
                          {imageWithTitle.title}
                        </h3>
                        <div
                          className={cx(
                            styles.currentSlideIndex,
                            'hidden sm:block transition-opacity duration-700'
                          )}
                        >
                          {idx < 10 ? `0${(idx % totalSlides) + 1}` : idx}
                        </div>
                        <img src={imageWithTitle?.image?.url} />
                      </div>
                    </SwiperSlide>
                  )
                })
              : null}
          </Swiper>

          <div className={styles.mobileSliderControl}>
            <div className="flex items-baseline w-full justify-end">
              <div className="new-swiper-button-prev">
                <img className={styles.arrowBack} />
              </div>
              <h4 className={styles.currentSlideIndexMobile}>
                {currentSlideIndex < 10
                  ? `0${currentSlideIndex}`
                  : currentSlideIndex}
              </h4>
              <h5 className={styles.totalSlidesMobile}>
                /{totalSlides < 10 ? '0' + totalSlides : totalSlides}
              </h5>
              <div className="block sm:hidden">
                <div
                  className={cx(
                    styles.rightArrowContainer,
                    'new-swiper-button-next'
                  )}
                >
                  <img
                    className={styles.arrowMobile}
                    src="/icons/slider-gallery-arrow-right.svg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={cx(styles.totalSlides, 'hidden sm:block')}>
            / {totalSlides < 10 ? '0' + totalSlides : totalSlides}
          </div>

          <div className={cx(styles.arrowContainer, 'hidden sm:block')}>
            <div className="new-swiper-button-prev">
              <img className={styles.arrowBack} />
            </div>
            <div
              className={cx(
                styles.rightArrowContainer,
                'new-swiper-button-next transition-transform duration-700 hover:translate-x-[20px]'
              )}
            >
              <img
                className={styles.arrow}
                src="/icons/slider-gallery-arrow-right.svg"
              />
            </div>
          </div>
        </div>
      </div>
      {hasDescription && (
        <div className={cx(styles.descriptionContainer, 'block sm:hidden')}>
          {images
            ? images.map((imageWithTitle, index) => (
                <BlockContent
                  key={index}
                  className={cx(styles.description, {
                    [styles.descriptionHidden]: currentSlideIndex === index + 1,
                  })}
                  blocks={imageWithTitle?.description}
                />
              ))
            : null}
        </div>
      )}
    </div>
  )
}

export default Gallery
