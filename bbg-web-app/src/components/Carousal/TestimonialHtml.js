import React from "react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
SwiperCore.use([Pagination, Autoplay, Navigation]);

const TestimonialHtml = ({ className = "", anchor = "", slides = [] }) => {
    return (
        <div className={`relative`} id={anchor}>
            <div className=" px-5 ">
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={false}
                    navigation={{
                        prevEl: ".testimonials-prev",
                        nextEl: ".testimonials-next",
                    }}
                    pagination={{
                        clickable: true,
                        el: `.testimonials-custom-pagination`,
                    }}
                >
                    {slides?.posts?.edges?.map((slide, index) => (
                        <SwiperSlide className="" key={index}>
                            <div className="my-1 w-full h-full">
                                <img
                                    src={
                                        slide?.node?.featuredImage?.node
                                            ?.sourceUrl
                                    }
                                    className="px-5"
                                    alt={`logo`}
                                    height="225px"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="left-0 flex items-center justify-between w-full transform -px-4 -translate-y-1/2 top-1/2  absolute">
                    <div className="cursor-pointer testimonials-prev z-10">
                        <span className="inline-block transform  en-long-arrow text-32 text-purple-midnight ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6 text-secondary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                                />
                            </svg>
                        </span>
                    </div>
                    <div className="testimonials-custom-pagination"></div>
                    <div className="cursor-pointer testimonials-next z-10">
                        <span className="en-long-arrow text-32 text-purple-midnight">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6 text-secondary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialHtml;
