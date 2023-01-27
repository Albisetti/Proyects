import React, { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import FocusTrap from 'focus-trap-react'
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
  const { enabled, message, link } = data

  if (!enabled) return null

  const hasMounted = useHasMounted()
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()

  if (!hasMounted || !message) return null

  return (
    <AnimatePresence>
      {!acceptedCookies && (
        <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
          <m.div
            initial="hide"
            animate="show"
            exit="hide"
            variants={barAnim}
            role="dialog"
            aria-live="polite"
            className="fixed bottom-0 right-0 z-9 w-full bg-white border-t-2 border-emerald"
          >
            <div className="container-x mx-auto">
              <div className="flex flex-col gap-y-[20px] md:flex-row md:items-center py-15 md:py-25 bg-pageText text-pageBG">
                <div className="flex-1">
                  <p className="text-[14px] md:text-[16px] leading-[16px] md:leading-[23px] text-deepBlueLight font-almarose">
                    {message.split('\n').map((text, i) => {
                      // using React.fragment to parse line breaks
                      return (
                        <React.Fragment key={i}>
                          {text}
                          {message.split('\n')[i + 1] && <br />}
                        </React.Fragment>
                      )
                    })}
                  </p>
                </div>

                <button
                  onClick={() => onAcceptCookies()}
                  className="border-2 transition-all duration-300 py-[15px] w-max rounded-[30px] group bg-white hover:bg-[#4AC1E0] px-[50px] border-[#4AC1E0]"
                >
                  <div className="flex items-center space-x-10">
                    <span className="text-[21px] leading-[25.2px] transition-all duration-300 text-[#4AC1E0] group-hover:text-white font-almarose font-bold">
                      Accept
                    </span>
                    <span className="text-[21px] font-wingdings transition-all duration-300 leading-[25.2px] group-hover:text-white text-[#4AC1E0] font-bold">
                      {'\u2B62'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </m.div>
        </FocusTrap>
      )}
    </AnimatePresence>
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
