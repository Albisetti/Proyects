import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectFade, Navigation, Pagination } from 'swiper'

SwiperCore.use([Navigation, EffectFade, Pagination])

import styles from './styles.module.scss'
import 'swiper/css'
import 'swiper/css/effect-fade'

const LandingCarousel = ({ data = {} }) => {
  const navigationPrevRef = React.useRef(null)
  const navigationNextRef = React.useRef(null)
  const [itemIndex, setItemIndex] = useState(0)
  const { items } = data
  return (
    <div className={styles.sliderContainer}>
      <div className="flex justify-between items-center">
        <h3 className={styles.title}>{items[itemIndex].title}</h3>
        <div className={styles.arrowContainer}>
          <div ref={navigationPrevRef} className="rotate-180 group">
            <svg
              className={styles.arrow}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="15" cy="15" r="14.5" transform="rotate(-90 15 15)" />
              <path d="M17.8851 9.99983C18.9215 11.9891 20.4079 13.7021 22.2228 14.9993C20.4214 16.312 18.9381 18.0219 17.8851 19.9998L16.8558 19.9998C17.846 18.0844 19.1993 16.3851 20.8384 14.9993C19.1979 13.611 17.8397 11.913 16.8397 9.99983L17.8851 9.99983Z" />
              <path d="M7.77763 15L21.111 15L7.77763 15Z" />
              <path d="M7.77763 15L21.111 15" />
            </svg>
          </div>
          <div ref={navigationNextRef} className=" cursor-pointer group ">
            <svg
              className={styles.arrow}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="15" cy="15" r="14.5" transform="rotate(-90 15 15)" />
              <path d="M17.8851 9.99983C18.9215 11.9891 20.4079 13.7021 22.2228 14.9993C20.4214 16.312 18.9381 18.0219 17.8851 19.9998L16.8558 19.9998C17.846 18.0844 19.1993 16.3851 20.8384 14.9993C19.1979 13.611 17.8397 11.913 16.8397 9.99983L17.8851 9.99983Z" />
              <path d="M7.77763 15L21.111 15L7.77763 15Z" />
              <path d="M7.77763 15L21.111 15" />
            </svg>
          </div>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = navigationPrevRef.current
          swiper.params.navigation.nextEl = navigationNextRef.current
        }}
        onSlideChange={(swiper) => setItemIndex(swiper.realIndex)}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        className={styles.swiper}
        speed={1000}
      >
        {items.map((slide, key) => {
          const { item } = slide
          return (
            <SwiperSlide key={key}>
              <div className={styles.slide}>
                {item.map((infoItem, key) => (
                  <div key={key} className={styles.itemContainer}>
                    <p className={styles.itemText}>{infoItem}</p>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default LandingCarousel
