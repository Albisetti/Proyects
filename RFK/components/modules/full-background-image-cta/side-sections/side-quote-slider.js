import React, { Fragment } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination } from 'swiper/core'

import 'swiper/css/pagination'
import 'swiper/css'

SwiperCore.use([Pagination])

const SideQuoteSlider = ({ quoteSlides }) => {
  const pagination = {
    clickable: true,
    el: '.announcement-custom-pagination',
  }

  return (
    <div className="md:relative">
      <div className="md:absolute md:right-0 md:top-1/2 md:translate-y-[-50%] md:translate-x-[25%] my-25 md:my-0 px-10">
        <Swiper
          pagination={pagination}
          modules={[Pagination]}
          slidesPerView={1}
          centeredSlides={true}
          className="max-w-[345px] h-[435px]  text-deepBlueLight bg-blueGray "
        >
          {quoteSlides.map((slide, idx) => (
            <SwiperSlide key={idx} className=" h-full flex flex-col px-30">
              <p className="font-sentinel font-bold text-[128px] leading-[0] mt-[70px] mb-[50px] text-royalBlue">
                “
              </p>
              <p className="text-[18.5px] leading-[28.5px] font-almarose font-medium mb-[50px] line-clamp-5">
                {slide.quote}
              </p>
              <p className="font-almarose text-[16px] leading-[19px] font-bold">
                {slide.authorTitle}
              </p>

              <p className="font-almarose text-[16px] leading-[19px] font-medium mb-auto">
                {slide.author}
              </p>
              <div className="announcement-custom-pagination mt-auto mb-30 w-full flex justify-center " />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default SideQuoteSlider
