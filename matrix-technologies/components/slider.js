import cx from 'classnames'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Autoplay } from 'swiper'

import BlockContent from '@components/block-content'
import SanityBackgroundImage from '@components/sanity-background-image'

import 'swiper/css'

SwiperCore.use([Navigation, Autoplay])

function Slider({ slides, className, slideClassName, hideNavigation }) {
  return (
    <Swiper
      className={className}
      navigation={hideNavigation ? false : true}
      loop={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
    >
      {slides?.map((slide, index) => {
        const { image, content } = slide

        // no image for any slide is breaking renders
        if (!image) {
          return null
        }

        return (
          <SwiperSlide key={index}>
            <div
              className={cx('relative h-full w-full', {
                [slideClassName]: slideClassName ? true : false,
              })}
            >
              <SanityBackgroundImage className="h-full w-full" image={image} />
              <div
                className={cx('absolute top-0 z-20 h-full w-full', {
                  ['bg-black bg-opacity-40 text-white']: content ? true : false,
                })}
              >
                <div
                  className="padding-x mx-auto flex h-full w-full max-w-[1170px] flex-col 
                    justify-between py-4 sm:py-8 md:py-16"
                >
                  {content && (
                    <>
                      <div>
                        {content?.title && (
                          <h3 className="max-w-[30ch] font-sans text-xl font-extrabold leading-none sm:text-[2rem] md:text-[2.5rem]">
                            {content?.title}
                          </h3>
                        )}
                      </div>
                      <div className="text-xs sm:text-2xl">
                        {content?.subtitle && (
                          <BlockContent
                            className="bio-content"
                            blocks={content?.subtitle}
                          />
                        )}
                        {content?.link && (
                          <Link href={content?.link?.url} passHref>
                            <a
                              className="mt-2 inline-block font-bold uppercase underline hover:no-underline sm:mt-4"
                              target={
                                content?.link?.internalExternal === 'external'
                                  ? '_blank'
                                  : '_self'
                              }
                            >
                              {content?.link?.label}
                            </a>
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export default Slider
