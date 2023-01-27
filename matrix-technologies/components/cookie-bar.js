import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Cookies from 'js-cookie'

import { useHasMounted } from '@lib/helpers'

import CustomLink from '@components/link'

const barAnim = {
  show: {
    y: '0%',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  hide: {
    y: '100%',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const CookieBar = React.memo(({ data = {} }) => {
  if (!data) return null

  const { enabled, message, link } = data

  if (!enabled) return null

  const hasMounted = useHasMounted()
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()

  if (!hasMounted || !message) return null

  return (
    <>
      {enabled && (
        <div className="fixed bottom-0 left-0 z-[60] h-auto w-full bg-blue bg-center py-6 font-montserrat font-bold shadow lg:py-4">
          <div className="container my-1">
            <div className="items-center justify-between lg:flex">
              <div className="lead mb-6 text-white lg:mb-0">{message}</div>
              <div className="grid grid-cols-2 gap-4">
                <a
                  className={`hover:text-green-600 group 
group flex cursor-pointer items-center justify-center rounded border border-white px-2 hover:bg-white `}
                  id={''}
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  <span
                    className={
                      ' block max-w-[198px] text-base  text-white  transition-all duration-100 group-hover:text-blue lg:text-lg'
                    }
                  >
                    'Cookie Settings'
                  </span>
                </a>
                <a
                  className={` group flex cursor-pointer items-center justify-center rounded border border-white px-2 hover:bg-white  `}
                  id={''}
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  <span
                    className={
                      ' block max-w-[198px] text-base  text-white  transition-all duration-100 group-hover:text-blue lg:text-lg '
                    }
                  >
                    'Accept'{' '}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

function useAcceptCookies(cookieName = 'accept_cookies') {
  const [acceptedCookies, setAcceptedCookies] = useState(true)

  useEffect(() => {
    if (!Cookies.get(cookieName)) {
      setAcceptedCookies(false)
    }
  }, [])

  const acceptCookies = () => {
    setAcceptedCookies(true)
    Cookies.set(cookieName, 'accepted', { expires: 365 })
  }

  return {
    acceptedCookies,
    onAcceptCookies: acceptCookies,
  }
}

export default CookieBar
