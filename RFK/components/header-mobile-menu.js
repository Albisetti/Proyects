import React, { Fragment, useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import cx from 'classnames'
import Link from 'next/link'

// For use with menu links
export const getHrefFromMenuLink = (l) =>
  l?.url ? l.url : `/${l.page?.isHome || l === 'home' ? '' : l.page?.slug}`

const HeaderMobileMenu = ({ open, navItems, buttons, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(-1)

  const isLight = false

  return (
    <div
      className={cx(
        'fixed top-0 bg-deepBlueLight pt-[90px] w-[300px] max-w-[100vw] z-[10] h-[100vh] lg:hidden transition-transform duration-500',
        {
          'translate-x-[-105%]': !open,
          'translate-x-0': open,
        }
      )}
    >
      <div className="h-full overflow-y-auto">
        {!!navItems &&
          navItems.map((item, idx) => {
            const navItem = (
              <Fragment key={'navitem-mb' + idx}>
                <div
                  className={cx(
                    'relative px-[30px] py-[9px] flex justify-between items-center cursor-pointer select-none group',
                    {
                      'bg-deepBlueDark':
                        openDropdown === idx && item.type.includes('dropdown'),
                    }
                  )}
                  onClick={() => {
                    if (openDropdown === idx) setOpenDropdown(-1)
                    else setOpenDropdown(idx)
                  }}
                >
                  <p
                    className={cx(
                      'mb-[6px] text-[18px] leading-[18.8px] font-medium transition-all duration-300 group-hover:text-white',
                      {
                        'text-white': !isLight || openDropdown === idx,
                        'text-deepBlueDark': isLight && openDropdown !== idx,
                      }
                    )}
                  >
                    {item.title}
                  </p>
                  {item?.type?.includes('dropdown') && (
                    <span className="relative flex justify-center w-[10px] mb-auto text-[18px] leading-[18.8px] text-white">
                      {openDropdown === idx ? '-' : '+'}
                    </span>
                  )}
                </div>

                {/* Dropdown - Small */}
                {openDropdown === idx && item?.type === 'dropdownSmall' && (
                  <div className="bg-deepBlueDark flex flex-col pl-[47px] pb-[15px] w-full">
                    {!!item?.dropdownSmallMenu &&
                      item.dropdownSmallMenu.items.map((link, idx_link) => (
                        <a
                          key={idx_link}
                          href={getHrefFromMenuLink(link)}
                          className="font-almarose text-white text-[15px] leading-[36px] whitespace-nowrap w-fit"
                        >
                          {link.title}
                        </a>
                      ))}
                  </div>
                )}

                {/* Dropdown - Medium/Large */}
                {openDropdown === idx &&
                  (navItems[openDropdown]?.type === 'dropdownMedium' ||
                    navItems[openDropdown]?.type === 'dropdownLarge') && (
                    <div
                      className={cx(
                        'bg-deepBlueDark flex flex-col pl-[40px] pr-[10px] w-full'
                      )}
                    >
                      {new Array(
                        navItems[openDropdown].type === 'dropdownMedium' ? 3 : 4
                      )
                        .fill(0)
                        .map((_, idx_col) => (
                          <div key={idx_col} className="flex-1 pb-[10px]">
                            {navItems[openDropdown]?.dropdownMediumMenu
                              ?.filter((i) => i.column - 1 === idx_col)
                              .map((links, idx_links) => (
                                <div key={idx_links} className="mb-[12px]">
                                  <p className="font-almarose font-bold text-lightBlue text-[18px] leading-[20px] mb-[3px]">
                                    {links.title}
                                  </p>
                                  {!!links.menu &&
                                    links.menu.items.map(
                                      (sublink, idx_sublink) => (
                                        <a
                                          key={idx_sublink}
                                          href={getHrefFromMenuLink(sublink)}
                                          className="block font-almarose text-white text-[15px] leading-[30px]"
                                          target={
                                            sublink?.url ? '_blank' : '_self'
                                          }
                                        >
                                          {sublink.title}
                                        </a>
                                      )
                                    )}
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  )}
              </Fragment>
            )

            if (item.type === 'rollOver')
              return (
                <Link
                  key={idx}
                  href={`/${
                    item?.navLink.slug === 'home' ? '' : item.navLink.slug
                  }`}
                >
                  {navItem}
                </Link>
              )
            return navItem
          })}
        <div className="flex flex-col gap-y-[15px] mt-[20px]">
          {!!buttons &&
            buttons.map((b, idx) => (
              <a
                key={idx}
                href={`/${b.pageLink?.slug === 'home' ? '' : b.pageLink?.slug}`}
                className={cx(
                  'ml-[32px] w-[124px] h-[32px] transition-all duration-300 hover:text-white border-2 border-lightBlue rounded-full flex justify-center items-center text-[10.58px] tracking-wider leading-[12.7px] font-almarose font-bold',
                  {
                    'bg-lightBlue text-deepBlueLight': b?.bgFilled,
                    'text-lightBlue hover:bg-lightBlue': !b?.bgFilled,
                  }
                )}
              >
                {b.title}
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}

export default HeaderMobileMenu
