import React from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'
import LinkButton from 'utils/Buttons/LinkButton'
import { isMenuItemActive } from '../../utils/navigation'

import Link from '@components/link'
import ToggleSearch from './toggle-search'
import ToggleMenu from './toggle-menu'

function NavigationDesktop({ menuItems }) {
  const router = useRouter()

  return (
    <>
      <nav className="flex items-center space-x-[34px]">
        <ul className="hidden  lg:flex lg:items-center lg:space-x-[24px]">
          {menuItems?.map((item, index) => (
            <li key={index}>
              <Link
                className={
                  item?.styleAsButton
                    ? 'btn btn--menu'
                    : cx('nav-buttons truncate', {
                        ['']: isMenuItemActive(
                          router.asPath,
                          item?.page?.slug,
                          item?.page?.isHome
                        ),
                      })
                }
                link={item}
                target={item?.page ? '_self' : '_blank'}
                title={item?.title}
              />
            </li>
          ))}

          <div className=" h-[27px]">
            <LinkButton
              text={'Contact Us'}
              url={'/'}
              target={'_blank'}
              style={'blueSmall'}
            />
          </div>
        </ul>
      </nav>

      <div className="mr-5 block truncate lg:hidden">
        <ToggleSearch />
      </div>
      <ToggleMenu className="block lg:hidden" />
    </>
  )
}

export default NavigationDesktop
