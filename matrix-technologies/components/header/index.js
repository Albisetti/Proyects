import React from 'react'
import Link from 'next/link'
import cx from 'classnames'

import { useSiteContext } from '@lib/context'

import SanityWidthImage from '@components/sanity-width-image'
import NavigationDesktop from './navigation-desktop'
import NavigationMobile from './navigation-mobile'
import ToggleSearch from './toggle-search'

const Header = ({ data = {}, scrolled }) => {
  const { isMobileNavigationOpen } = useSiteContext()
  const { logo, menu, emergencySupportMessage } = data
  const hasLogo = logo?.url

  return (
    <>
      <a className="sr-only" href="#content">
        Skip to Content
      </a>
      <div className="bg-transparent pb-12 xl:pb-[58px]">
        <header
          className={cx(
            'fixed top-0 left-0 z-10 w-full pt-5 pb-[30px] transition-all duration-300 sm:pt-0 lg:pb-0',
            {
              ['bg-white ']: scrolled,
              ['shadow-md']: scrolled && !isMobileNavigationOpen,
            }
          )}
        >
          <div className=" hidden h-8 items-center truncate bg-blue text-[12px] font-black leading-6 tracking-[8px] text-white lg:flex lg:justify-center lg:pl-48 xl:h-14 xl:pl-[420px] xl:text-[20px] xxl:container">
            <div className="mr-40">{emergencySupportMessage} </div>
            <div className="">
              <ToggleSearch className={'message'} />
            </div>
          </div>
          <div className="flex h-full items-center justify-between px-8 sm:gap-12 sm:px-10 sm:pt-10 md:px-20 lg:justify-center lg:pb-16 xl:gap-[90px] xxl:container">
            {hasLogo && (
              <Link href="/">
                <a className="grow-hover">
                  <SanityWidthImage
                    className="h-auto w-[197px] xl:w-[334px]"
                    image={logo}
                    alt={logo?.alt}
                  />
                </a>
              </Link>
            )}
            <div className="flex min-w-fit xl:mt-8">
              <NavigationDesktop menuItems={menu?.items} />
            </div>
          </div>
        </header>
      </div>
      <div className="lg:hidden">
        <NavigationMobile menuItems={menu?.items} />
      </div>
      {/* <SearchScreen
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
          /> */}
    </>
  )
}

export default Header
