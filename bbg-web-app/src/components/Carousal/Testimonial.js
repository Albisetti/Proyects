import React from "react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "../Loader/Loader";
SwiperCore.use([Pagination, Autoplay, Navigation]);

const Testimonial = ({ className = "", anchor = "", slides = [], loading }) => {
    return (
        <div className={`relative h-full`} id={anchor}>
            {loading?
            
            <div className="h-full">
                <Loader />
            </div> :
            <div className=" rounded-lg">
                <Swiper
                    className="rounded-lg"
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay:5000
                    }}
                    navigation={{
                        prevEl: ".testimonials-prev",
                        nextEl: ".testimonials-next",
                    }}
                    pagination={{
                        clickable: true,
                        el: `.testimonials-custom-pagination`,
                    }}
                >
                    {slides?.posts?.edges?.map((slide, index) => {
                        
                        let url = slide?.node?.featuredImage?.node?.sourceUrl;
                        return (
                            <SwiperSlide className="" key={index}>
                                <div
                                    className="w-full bg-cover bg-center relative  rounded-lg"
                                    style={{
                                        backgroundImage: `url(${url})`,
                                        height:"242px"
                                    }}
                                >
                                    <p className="text-white font-title font-bold absolute left-16 top-1/2 transform -translate-y-1/2  xl:text-5xl" style={{ maxWidth:"50%", textShadow: "-2px 2px 9px black",}}> {slide?.node?.title} </p>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <div className="left-0 flex items-center justify-between w-full transform px-2 -translate-y-1/2 top-1/2  absolute z-10">
                    <div className="cursor-pointer testimonials-prev z-10">
                        <span className="inline-block transform  en-long-arrow text-32 text-purple-midnight ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-8 w-8 text-primary"
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

                    <div className="cursor-pointer testimonials-next z-10">
                        <span className="en-long-arrow text-32 text-purple-midnight">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-8 w-8 text-primary"
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
}
        </div>
    );
};

export default Testimonial;
