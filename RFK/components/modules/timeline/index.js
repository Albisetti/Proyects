import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'

SwiperCore.use([Navigation])

const Timeline = ({ data = {} }) => {
  const navigationPrevRef = React.useRef(null)
  const navigationNextRef = React.useRef(null)

  const { title, description, timeEvents } = data
  return (
    <div className="py-55 bg-slateGray">
      <div className="container-x-timeline">
        <div className="px-20 sm:px-35 md:px-0">
          <div>
            <div className="h-3 w-72 mb-5 bg-lightBlue" />
            <h2 className="text-deepBlueLight font-almarose font-bold text-[32px] leading-[38px] max-w-[535px]">
              {title}
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <p className="!text-deepBlueLight text-[16px] leading-[24px] mt-20 max-w-[520px]">
              {description}
            </p>
            <div className="sm:flex justify-between w-100 hidden">
              <span ref={navigationPrevRef} className="font-wingdings min-w-40">
                {' '}
                <img
                  src="/images/about-us-page/arrow.png"
                  className=" rotate-180 cursor-pointer"
                />
              </span>
              <span ref={navigationNextRef} className="font-wingdings w-[40px]">
                <img
                  src="/images/about-us-page/arrow.png"
                  className=" cursor-pointer"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="mt-50 mx-auto">
          <Swiper
            breakpoints={{
              480: {
                slidesPerView: 2,
                slidesOffsetBefore: 35,
              },
              768: {
                slidesPerView: 3,
                slidesOffsetBefore: 100,
              },
            }}
            modules={[Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current
              swiper.params.navigation.nextEl = navigationNextRef.current
            }}
            grabCursor={true}
            slidesOffsetBefore={20}
          >
            {timeEvents.map((timeEvent, key) => (
              <SwiperSlide key={key}>
                <div className="relative xs:mx-auto xs:px-0">
                  <div className="px-5">
                    <h3 className="text-emerald font-bold font-almarose text-16 leading-22 absolute xs:left-[-22px] mt-8">
                      {timeEvent.date}
                    </h3>
                    <div className="relative h-15 flex items-center pt-40">
                      {key + 1 === timeEvents.length && (
                        <div className="w-3 h-15 bg-emerald absolute right-0" />
                      )}
                      <div className="w-15 h-15 bg-emerald rounded-full absolute left-[-10px]" />

                      <div className="bg-emerald h-4 w-full" />
                    </div>
                    <div className="mt-25 max-w-[230px] sm:max-w-[340px]">
                      <p className="text-[16px] leading-[24px] text-deepBlueLight font-almarose mb-10">
                        {timeEvent?.description}
                      </p>
                      <img src={timeEvent?.image} className="max-h-[150px]" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default Timeline
