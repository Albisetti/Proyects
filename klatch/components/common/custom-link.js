import Link from 'next/link'
import React from 'react'
import styles from './custom-link.module.scss'

const CustomLink = ({
  color,
  title,
  href = '/',
  buttonWrapper = '',
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
        className={`border-2 transition-all duration-300 ${
          buttonWrapper ? buttonWrapper : styles.buttonWrapper
        } ${buttonColorHandler()} `}
        target={target}
      >
        <span className={`${styles.buttonText} `}>{title}</span>
      </a>
    </Link>
  )
}

export default CustomLink
