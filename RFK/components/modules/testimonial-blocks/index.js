import React from 'react'
import cx from 'classnames'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css/pagination'
import 'swiper/css'

const TestimonialBlockElem = (block, idx, tall = false) => (
  <div
    key={idx}
    className={cx(
      'relative flex items-end w-[345px] max-w-[90vw] h-[508px] mx-auto'
    )}
  >
    <div
      className={cx(
        'relative flex flex-col transition-all w-full duration-300 bg-blueGray pb-[33px] pt-[65px] xs:py-[63px] pl-[20px] xs:pl-[36px] pr-[12px]',
        { 'h-[508px]': tall, 'h-[435px]': !tall }
      )}
    >
      <img
        src={block.image || '/images/careers-page/bg-camera.png'}
        alt=""
        className="absolute w-[123.5px] h-[123.5px] rounded-full top-0 translate-y-[-50%] left-[50%] translate-x-[-50%] object-cover"
      />
      <p className="font-sentinel font-bold text-[128px] leading-[0] mt-[50px] mb-[30px] text-royalBlue">
        “
      </p>
      <p
        className={cx(
          'font-almarose font-medium text-[18.35px] leading-[28.26px] text-deepBlueLight mb-auto transition-all duration-300 max-h-fit overflow-hidden',
          { 'line-clamp-5 text-ellipsis max-h-[143px]': !tall }
        )}
      >
        {block.content}
      </p>
      <div className="mt-auto">
        <p className="font-almarose font-bold text-deepBlueLight text-[15.73px] leading-[18.88px] mb-[4px]">
          {block.quoteeName}
        </p>
        <p className="font-almarose text-deepBlueLight font-medium text-[15.73px] leading-[18.84px]">
          {block.programName}
        </p>
      </div>
    </div>
  </div>
)

const TestimonialBlocks = ({ data = {} }) => {
  const { items } = data

  if (!items?.length) return null

  const mode = items?.length && items.length > 3 ? 'slider' : 'static'

  return (
    <div className="relative w-full pt-[54px] min-h-[720px] pb-[70px]">
      <div className="relative z-1 container-x">
        <div className="bg-lightBlue w-[72px] h-[3px] rounded-full mb-[20px]" />
        <p className="text-[31.46px] leading-[22.29px] text-deepBlueLight font-almarose font-bold mb-[35px]">
          Testimonials
        </p>

        <div
          className={cx(
            'w-full min-h-[498px] grid-cols-1 lg:grid-cols-3 gap-x-[3.5vw] gap-y-[102px] lg:gap-y-0 items-end justify-between hidden',
            { 'lg:grid': mode === 'static' }
          )}
        >
          {items.map((block, idx) =>
            TestimonialBlockElem(
              block,
              idx,
              mode === 'static' && idx === 1 && items.length >= 3
            )
          )}
        </div>
      </div>
      <Swiper
        spaceBetween={48}
        slidesPerView={1}
        centeredSlides={true}
        initialSlide={items?.length && items.length > 1 ? 1 : 0}
        className={cx('lg:w-[1200px] swiper-wrapper-align-end', {
          'lg:hidden': mode === 'static',
        })}
        breakpoints={{
          1140: {
            slidesPerView: 3,
          },
          700: {
            slidesPerView: 2,
          },
          490: {
            slidesPerView: 1.5,
          },
        }}
      >
        {items.map((block, idx) => (
          <SwiperSlide key={'slide' + idx} className="mt-[65px]">
            {({ isActive }) => TestimonialBlockElem(block, idx, isActive)}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute bottom-0 left-0 w-full h-[calc(100%-265px)] lg:h-[453px] bg-emerald z-0" />
    </div>
  )
}

export default TestimonialBlocks
