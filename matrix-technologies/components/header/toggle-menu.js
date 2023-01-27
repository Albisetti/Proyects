import React from 'react'
import cx from 'classnames'
import { motion } from 'framer-motion'

import { useSiteContext, useToggleMobileNavigation } from '@lib/context'

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
)

const ToggleMenu = ({ className }) => {
  const { isMobileNavigationOpen } = useSiteContext()
  const toggleMobileNavigation = useToggleMobileNavigation()

  return (
    <button
      className={cx('mt-[5px] flex items-center', className)}
      onClick={() => toggleMobileNavigation()}
    >
      {!isMobileNavigationOpen ? (
        <img src="/mobileNavIcon.svg"></img>
      ) : (
        <img src="/closeIcon.svg"></img>
      )}
    </button>
  )
}

export default ToggleMenu
