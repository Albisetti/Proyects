import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

import { useSiteContext } from '@lib/context'

import ToggleSearch from './toggle-search'

function NavigationMobile({ menuItems }) {
  const { isMobileNavigationOpen } = useSiteContext()

  useEffect(() => {
    if (isMobileNavigationOpen) document.body.classList.add('no-scroll')
    else document.body.classList.remove('no-scroll')
  }, [isMobileNavigationOpen])

  return (
    <AnimatePresence>
      {isMobileNavigationOpen && (
        <motion.nav
          className="px-sm fixed top-0 left-0 z-[2] h-screen w-screen overflow-auto bg-white"
          initial="closed"
          animate="open"
          exit="closed"
          variants={{
            closed: { x: '100%' },
            open: { x: 0 },
          }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.05 }}
        >
          <ul className="mt-[125px]  flex flex-col items-center space-y-[14px]">
            <li>
              <ToggleSearch />
            </li>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={
                    item?.page
                      ? item?.page?.isHome
                        ? '/'
                        : `/${item?.page?.slug}`
                      : item?.url
                  }
                >
                  <a
                    className="block font-montserrat text-[20px] font-bold uppercase leading-[30px] text-blue"
                    target={item?.page ? '_self' : '_blank'}
                  >
                    {item?.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

export default NavigationMobile
