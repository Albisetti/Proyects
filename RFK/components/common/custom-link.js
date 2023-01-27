import Link from 'next/link'
import React from 'react'

const CustomLink = ({
  color,
  title,
  href = '/',
  className = '',
  textClassName = '',
  target = '_self',
}) => {
  const buttonColorHandler = () => {
    switch (color) {
      case 'orange':
        return 'bg-orange border-orange hover:border-orange text-white hover:bg-white hover:text-orange'
      case 'green':
        return 'bg-green border-green hover:border-green text-white hover:bg-white hover:text-green'
      case 'pink':
        return 'bg-pink border-pink hover:border-pink text-white hover:bg-white hover:text-pink'
      case 'blue':
        return 'bg-blue border-blue hover:border-blue text-white hover:bg-white hover:text-blue'
      default:
        return 'border-transparent'
        break
    }
  }

  return (
    <Link href={href}>
      <a
        className={`relative border transition-all duration-300 py-[15px] w-max rounded-[30px] group hover:bg-[#4AC1E0] mt-25 px-[50px] border-[#4AC1E0] ${className}`}
        target={target}
      >
        <div className={`flex items-center space-x-10`}>
          <span
            className={`text-[21px] leading-[25.2px] transition-all duration-300 text-[#4AC1E0] group-hover:text-white font-almarose font-bold ${textClassName}`}
          >
            {title}
          </span>
          <span
            className={`text-[21px] font-wingdings transition-all duration-300 leading-[25.2px] group-hover:text-white text-[#4AC1E0] font-bold ${textClassName}`}
          >
            {'\u2B62'}
          </span>
        </div>
      </a>
    </Link>
  )
}

export default CustomLink
