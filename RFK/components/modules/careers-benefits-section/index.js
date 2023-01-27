import React, { useState } from 'react'
import cx from 'classnames'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css/pagination'
import 'swiper/css'

const CareersBenefitsSection = ({ data = {} }) => {
  const { title, sliderImages, items, itemsPadding } = data

  const [sliderComponent, setSliderComponent] = useState(null)
  const [slideIsBeginning, setSlideIsBeginning] = useState(true)
  const [slideIsEnd, setSlideIsEnd] = useState(false)

  return (
    <div className="relative w-full">
      <div className="relative container-x py-[50px] xs:pt-[65px] xs:pb-[85px] z-1">
        <div className="w-[72px] h-[3px] rounded-full bg-lightBlue mb-[25px]" />
        <p className="font-almarose font-bold text-[31.46px] leading-[32px] text-deepBlueLight mb-[36px]">
          {title}
        </p>

        {sliderImages?.length && (
          <div className="relative w-[calc(100%-40px)] sm:w-full mx-auto h-fit">
            <Swiper
              onInit={(swiper) => setSliderComponent(swiper)}
              onTransitionStart={(swiper) => {
                setSlideIsBeginning(swiper.isBeginning)
                setSlideIsEnd(swiper.isEnd)
              }}
              slidesPerView={1}
              spaceBetween={0}
              centeredSlides={true}
              breakpoints={{
                400: {
                  spaceBetween: 6,
                  centeredSlides: false,
                  slidesPerView: 'auto',
                },
              }}
              className="w-full h-[200px] xs:h-[275px] swiper-slides-width-fit mb-[58px]"
            >
              {sliderImages
                .filter((img) => !!img?.url)
                .map((img, idx) => (
                  <SwiperSlide key={idx} className="flex justify-center">
                    <img src={img.url} alt="" className="h-full object-cover" />
                  </SwiperSlide>
                ))}
            </Swiper>
            <button
              className="absolute top-[50%] left-0 translate-x-[-50%] translate-y-[-50%] z-[9999] rounded-full bg-lightBlue hover:bg-white text-white hover:text-lightBlue font-wingdings w-[37px] h-[37px] text-[16px] transition-all duration-300 disabled:opacity-50 disabled:bg-coolGray disabled:text-white"
              disabled={slideIsBeginning}
              onClick={() => {
                if (sliderComponent) sliderComponent.slidePrev()
              }}
            >
              {'\u2B60'}
            </button>
            <button
              className="absolute top-[50%] right-0 translate-x-[50%] translate-y-[-50%] z-[9999] rounded-full bg-lightBlue hover:bg-white text-white hover:text-lightBlue font-wingdings w-[37px] h-[37px] text-[16px] transition-all duration-300 disabled:opacity-50 disabled:bg-coolGray disabled:text-white"
              disabled={slideIsEnd}
              onClick={() => {
                if (sliderComponent) sliderComponent.slideNext()
              }}
            >
              {'\u2B62'}
            </button>
          </div>
        )}
        <div
          className={cx('grid grid-cols-1 md:grid-cols-2 gap-[62px]', {
            'xs:px-[62px]': itemsPadding,
          })}
        >
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center col-span-1">
              {!!item?.image && (
                <img
                  src={item.image}
                  alt=""
                  className="w-[70px] h-[70px] object-contain mr-[27px]"
                />
              )}
              <div className="font-almarose font-semibold text-[23.6px] leading-[26.22px] text-lightBlue">
                <span className="block">{item.titleFirst}</span>
                {!!item.titleSecond && (
                  <span className="block">{item.titleSecond}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <img
        src="/images/careers-page/bg-benefits.jpg"
        alt=""
        className="absolute bottom-0 left-0 z-0 w-full h-[calc(100%-270px)] xs:h-[calc(100%-374px)] object-cover"
      />
    </div>
  )
}

export default CareersBenefitsSection
