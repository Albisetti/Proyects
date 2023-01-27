import React from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

SwiperCore.use([Navigation, Pagination, Autoplay]);

const Slider = ({ slides, loop, autoplay, delay, pagination, content }) => {
  return (
    <section>
      <div className="xl:container">
        <div className="relative flex items-center lg:px-[38px] xl:px-0">
          {/* Left Arrow */}
          <div className="button-prev absolute translate-x-[-100%] left-[24px] xl:left-[-24px] hidden lg:block w-[31.42px] h-[63.42px] cursor-pointer">
            <img
              src="/svg/carousel-arrow-left.svg"
              alt="<"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Slider */}
          <Swiper
            className="w-full"
            modules={[Navigation, Pagination]}
            loop={loop}
            autoplay={
              autoplay
                ? {
                    delay,
                    disableOnInteraction: false,
                  }
                : false
            }
            pagination={pagination}
            navigation={{
              nextEl: ".button-next",
              prevEl: ".button-prev",
            }}
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <img
                    src={slide}
                    className="w-full h-full max-h-[300px] object-cover object-center"
                  />
                  {content && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black text-white bg-opacity-10 z-[1] flex items-center justify-center p-8">
                      <p>{content}</p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right Arrow */}
          <div className="button-next absolute right-[24px] xl:right-[-24px] translate-x-[100%] hidden lg:block w-[31.42px] h-[63.42px] cursor-pointer">
            <img
              src="/svg/carousel-arrow-right.svg"
              alt=">"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

Slider.propTypes = {
  slides: PropTypes.array,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  delay: PropTypes.number,
  pagination: PropTypes.bool,
  content: PropTypes.string,
};

Slider.defaultProps = {
  slides: [],
  loop: true,
  autoplay: true,
  delay: 3000,
  pagination: false,
};

export default Slider;
