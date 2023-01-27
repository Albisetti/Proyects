import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useClickOutside } from 'util/click-outside'
import { useWindowSizeAdjustments } from 'util/window-resize'

import NavigationDesktop from './navigation-desktop'
import NavigationMobile from './navigation-mobile'

import styles from './header.module.scss'

const Header = ({ data = {} }) => {
  const { mainMenu, logo } = data

  const router = useRouter()
  const dropdownRef = useRef()
  const [navigationMobileOpen, setNavigationMobileOpen] = useState(false)
  const { windowWidth } = useWindowSizeAdjustments()
  useClickOutside(dropdownRef, () => setDropdownOpen(false))

  const isMobile = windowWidth < 1024
  const isDesktop = windowWidth >= 1024

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerLogoContainer}>
            {router.pathname === '/' ? (
              <a aria-label="Go Home" onClick={() => window.scrollTo(0, 0)}>
                <img src={logo.url} className={styles.logo} />
              </a>
            ) : (
              <Link href="/" scroll={false}>
                <a aria-label="Go Home">
                  <img src={logo.url} className={styles.logo} />
                </a>
              </Link>
            )}
          </div>

          {isMobile && (
            <svg
              viewBox="0 0 100 80"
              className={styles.menuToggle}
              onClick={() => setNavigationMobileOpen(true)}
            >
              <path d="M0 0h100v10H0zM0 30h100v10H0zM0 60h100v10H0z" />
            </svg>
          )}

          {isDesktop && (
            <>
              <NavigationDesktop mainMenu={mainMenu} />
              <div className={styles.headerSearchIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 15.25 15.33"
                >
                  <defs>
                    <style
                      dangerouslySetInnerHTML={{
                        __html: '.cls-1{fill:#50555b;}',
                      }}
                    />
                  </defs>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Header">
                      <path
                        className="cls-1"
                        d="M14.73,13.26h0l-.11-.11h0L11,9.54A6,6,0,0,0,12.08,6a6,6,0,1,0-6,6,6,6,0,0,0,3.34-1l3.77,3.71.41.41c.27.27.83.13,1.25-.29s.57-1,.3-1.26ZM9.07,3a4.25,4.25,0,1,1-6,.12A4.24,4.24,0,0,1,9.07,3Z"
                      />
                    </g>
                  </g>
                </svg>
              </div>
            </>
          )}
        </div>

        {isMobile && (
          <NavigationMobile
            mainMenu={mainMenu}
            open={navigationMobileOpen}
            setOpen={setNavigationMobileOpen}
          />
        )}
      </header>
    </>
  )
}

export default Header
