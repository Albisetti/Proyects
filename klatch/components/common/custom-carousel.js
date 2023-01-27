import { useState } from 'react'
import Slider from 'react-slick'
import cx from 'classnames'

import 'slick-carousel/slick/slick.css'

import styles from './custom-carousel.module.scss'

const getDotColorClassName = (color) => {
  switch (color) {
    case 'blue':
      return styles.carouselDotBlue
    case 'green':
      return styles.carouselDotGreen
    case 'red':
      return styles.carouselDotRed
    case 'orange':
      return styles.carouselDotOrange
    default:
      return styles.carouselDotBlue
  }
}

function CustomCarousel({
  wrapperClass,
  dotWrapperClass,
  dotColor,
  dotBorders = false,
  children,
}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const settings = {
    dots: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (prev, next) => {
      setCurrentSlide(next)
    },
    appendDots: (dots) => {
      return (
        <div>
          <ul
            className={cx(styles.carouselDotList, {
              [styles.carouselDotListBorders]: dotBorders,
              [dotWrapperClass]: dotWrapperClass ? true : false,
            })}
          >
            {dots.map((item, index) => {
              return <li key={index}>{item.props.children}</li>
            })}
          </ul>
        </div>
      )
    },
    customPaging: (index) => {
      return (
        <button
          className={cx(styles.carouselDot, getDotColorClassName(dotColor), {
            [styles.carouselDotActive]: index === currentSlide,
          })}
        >
          {index + 1}
        </button>
      )
    },
  }

  return (
    <Slider {...settings} className={cx('custom-carousel', wrapperClass)}>
      {children}
    </Slider>
  )
}

export default CustomCarousel
