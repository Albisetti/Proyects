import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination } from 'swiper/core'

// Import Swiper styles
import 'swiper/css/pagination'
import 'swiper/css'

import Link from 'next/link'
import { imageBuilder } from '@lib/sanity'

SwiperCore.use([Pagination])

const FeatureCarousel = ({ data = {} }) => {
  const { title, items } = data

  const pagination = {
    clickable: true,
    el: '.announcement-custom-pagination',
  }

  return (
    <>
      <div className="relative container-x pt-55">
        <Swiper
          pagination={pagination}
          modules={[Pagination]}
          className="w-full "
        >
          {items?.map((slide, i) => {
            const assetUrl = imageBuilder.image(slide?.featuredImage)?.url()

            return (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full  flex md:flex-row flex-col-reverse">
                  <div className="flex-1 md:max-w-[374.77px]  flex-col items-center justify-center bg-slateGray">
                    <div className="py-[50px] md:pb-0 md:pt-[45px] px-[45px] relative h-full flex flex-col">
                      {title && (
                        <p className="font-almarose font-bold uppercase text-deepBlueDark text-[15.52px] leading-[18.84px] ">
                          {title}
                        </p>
                      )}
                      <p className="font-sentinel text-[35.48px] leading-[42.57px] text-deepBlueDark mt-[29.56px]">
                        {slide?.title}
                      </p>
                      <p className="font-sentinel text-[20.69px] leading-[24.83px] text-deepBlueDark mt-[50.92px]">
                        {slide?.excerpt}
                      </p>
                      <Link
                        className="mb-auto"
                        href={`/${slide?._type}s/${slide?.slug}`}
                      >
                        <a className="transition-all duration-300 w-max group">
                          <div className="mt-[14.78px] flex items-center space-x-5">
                            <span className="text-[15.52px] leading-[18.84px] transition-all duration-300 text-deepBlueDark group-hover:text-opacity-70 font-almarose underline">
                              Read More
                            </span>
                            <span className="text-[15.52px] leading-[18.84px] font-almarose transition-all duration-300 group-hover:text-opacity-70 text-deepBlueDark ">
                              &gt;
                            </span>
                          </div>
                        </a>
                      </Link>
                      <div className="announcement-custom-pagination z-[100] md:mt-auto mt-30 md:mb-30 w-full flex justify-center" />
                    </div>
                  </div>
                  <div className="flex-1 md:max-w-[895px] md:h-[466px] ">
                    <img
                      src={assetUrl}
                      className="w-full h-full aspect-video md:aspect-auto object-cover"
                    />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </>
  )
}

export default FeatureCarousel
