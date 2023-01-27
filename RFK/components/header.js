import React, { useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import cx from 'classnames'
import Link from 'next/link'
import HeaderMobileMenu from './header-mobile-menu'

export const headerHeight = 'h-[114px]'

// For use with menu links
export const getHrefFromMenuLink = (l) =>
  l?.url ? l.url : `/${l.page?.isHome || l === 'home' ? '' : l.page?.slug}`

const Header = ({ data = {}, isTransparent, isLight, onSetup = () => {} }) => {
  const { logoImg, logoImgBright, navItems, buttons } = data

  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(-1)
  const [currentSlug, setCurrentSlug] = useState()

  const [pageScrolled, setPageScrolled] = useState(false)

  // Scroll
  useEffect(() => {
    if (!isTransparent) return

    const listener = (e) => {
      const scrolled = document.scrollingElement?.scrollTop
      if (scrolled && scrolled >= 80) {
        if (!pageScrolled) setPageScrolled(true)
      } else {
        if (pageScrolled) setPageScrolled(false)
      }
    }
    document.addEventListener('scroll', listener)
    return () => {
      document.removeEventListener('scroll', listener)
    }
  }, [pageScrolled])

  useEffect(() => {
    setCurrentSlug(window.location.pathname)
  }, [])

  const LogoImage = (
    <Link href="/">
      <div className="relative cursor-pointer z-[8] pl-[50px] xs:pl-0">
        <img
          src={
            !isLight || (isLight && !logoImgBright) ? logoImg : logoImgBright
          }
          alt=""
          className="lg:ml-[38px] lg:mr-[0.6vw] max-w-[180px] xxs:max-w-[224px] max-h-[40px] xxs:max-h-[66px]"
        />
      </div>
    </Link>
  )

  const itemHasPageOpen = (item) => {
    if (!currentSlug) return false
    if (currentSlug.includes('404')) return false

    if (item.dropdownSmallMenu && item.dropdownSmallMenu?.items?.length) {
      return item.dropdownSmallMenu.items.find(
        (link) => getHrefFromMenuLink(link) === currentSlug
      )
    } else if (
      item.dropdownMediumMenu &&
      item.dropdownMediumMenu?.items?.length
    ) {
      return item.dropdownMediumMenu.items.find(
        (links) =>
          !!links.menu &&
          links.menu.items.find(
            (sublink) => getHrefFromMenuLink(sublink) === currentSlug
          )
      )
    }
    return false
  }

  return (
    <>
      {!isTransparent && <div className={headerHeight} />}

      <HeaderMobileMenu
        open={mobileNavOpen}
        navItems={navItems}
        buttons={buttons}
      />

      {/* Mobile Header Burger Button */}
      <div className={cx('fixed top-0 left-0 z-[11] lg:hidden', headerHeight)}>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className={cx(
            'absolute left-[20px] top-[50%] translate-y-[-50%] bg-transparent',
            {
              'is-open': mobileNavOpen,
            }
          )}
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle Menu"
        >
          <span className="hamburger">
            <span className="hamburger--icon" />
          </span>
        </button>
      </div>

      <header
        className={cx(
          'fixed flex justify-center top-0 left-0 w-full z-[9] transition-all duration-300',
          headerHeight,
          {
            'bg-deepBlueLight': !isLight && (!isTransparent || pageScrolled),
            'bg-white': isLight && (!isTransparent || pageScrolled),
          }
        )}
      >
        {/* Mobile Header */}

        <div className="relative lg:hidden flex items-center justify-center gap-[20px]">
          {LogoImage}
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex w-[1270px] h-full justify-between items-center">
          {LogoImage}
          <div className="flex flex-col justify-between items-end mr-[5vw] pt-[30px] h-full">
            {/* Buttons */}
            <div className="flex">
              {!!buttons &&
                buttons.map((b, idx) => {
                  const linkHref =
                    b.linkType === 'internal'
                      ? b.pageLink?.slug === 'home'
                        ? '/'
                        : `/${b.pageLink?.slug || '404'}`
                      : b.linkType === 'external'
                      ? b.externalLink || '/404'
                      : '/404'
                  return (
                    <a
                      key={idx}
                      href={linkHref}
                      target={
                        b.linkType === 'external' && linkHref !== '/404'
                          ? '_blank'
                          : '_self'
                      }
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
                  )
                })}
            </div>

            {/* Navigation Items */}
            <div className="flex">
              {!!navItems &&
                navItems.map((item, idx) => {
                  const navItem = (
                    <div
                      key={'navitem' + idx}
                      className={cx(
                        'relative w-[127px] h-[57px] flex justify-center items-center cursor-pointer select-none group',
                        {
                          'bg-deepBlueDark':
                            openDropdown === idx &&
                            item.type.includes('dropdown'),
                        }
                      )}
                      onClick={() =>
                        setOpenDropdown(openDropdown === idx ? -1 : idx)
                      }
                    >
                      <p
                        className={cx(
                          'mb-[6px] text-[13.89px] leading-[18.8px] font-bold transition-all duration-300',
                          {
                            'text-lightBlue':
                              (!!item.navLink?.slug &&
                                !!currentSlug &&
                                currentSlug.includes(item.navLink?.slug)) ||
                              itemHasPageOpen(item),
                            'text-white':
                              !isLight ||
                              (openDropdown === idx &&
                                item.type !== 'rollOver'),
                            'text-deepBlueDark':
                              isLight && openDropdown !== idx,
                            'group-hover:text-[#AAAAAA]':
                              openDropdown !== idx && !itemHasPageOpen(item),
                          }
                        )}
                      >
                        {item.title}
                      </p>
                      {item?.type?.includes('dropdown') && (
                        <span className="relative w-[11px] h-[5px] mb-[5px]">
                          <img
                            src={
                              !isLight || (isLight && openDropdown === idx)
                                ? 'nav-arrow.svg'
                                : 'nav-arrow-dark.svg'
                            }
                            alt=""
                            className={cx(
                              'w-[11px] h-[5px] ml-[7px] transition-transform duration-200',
                              {
                                'rotate-180': openDropdown === idx,
                              }
                            )}
                          />
                        </span>
                      )}

                      {/* Dropdown - Small */}
                      {openDropdown === idx && item?.type === 'dropdownSmall' && (
                        <OutsideClickHandler
                          onOutsideClick={() => setOpenDropdown(-1)}
                        >
                          <div className="bg-deepBlueDark flex flex-col absolute left-0 top-[91%] p-[17px] pt-0 w-fit">
                            {!!item?.dropdownSmallMenu &&
                              item.dropdownSmallMenu.items.map(
                                (link, idx_link) => (
                                  <a
                                    key={idx_link}
                                    href={getHrefFromMenuLink(link)}
                                    className={cx(
                                      'font-almarose text-white text-[13.89px] leading-[26px] hover:underline whitespace-nowrap w-fit',
                                      {
                                        '!text-lightBlue':
                                          !!currentSlug &&
                                          !currentSlug.includes('404') &&
                                          getHrefFromMenuLink(link) ===
                                            currentSlug,
                                      }
                                    )}
                                  >
                                    {link.title}
                                  </a>
                                )
                              )}
                          </div>
                        </OutsideClickHandler>
                      )}
                    </div>
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
            </div>
          </div>
        </div>
      </header>

      {/* Dropdown - Medium/Large */}
      {openDropdown !== -1 &&
        (navItems[openDropdown]?.type === 'dropdownMedium' ||
          navItems[openDropdown]?.type === 'dropdownLarge') && (
          <OutsideClickHandler onOutsideClick={() => setOpenDropdown(-1)}>
            <div
              className={cx(
                'bg-deepBlueDark fixed flex justify-center z-10 left-0 pt-0 w-full',
                { 'mt-[114px]': isTransparent }
              )}
            >
              <div className="w-[1270px] pl-[145px] flex">
                {new Array(
                  navItems[openDropdown].type === 'dropdownMedium' ? 3 : 4
                )
                  .fill(0)
                  .map((_, idx_col) => (
                    <div key={idx_col} className="flex-1 py-[35px]">
                      {navItems[openDropdown]?.dropdownMediumMenu
                        ?.filter((i) => i.column - 1 === idx_col)
                        .map((links, idx_links) => (
                          <div
                            key={idx_links}
                            className="mb-[15px] max-w-[300px]"
                          >
                            <p className="font-almarose font-bold text-lightBlue text-[13.89px] leading-[17.2px]">
                              {links.title}
                            </p>
                            {!!links.menu &&
                              links.menu.items.map((sublink, idx_sublink) => (
                                <a
                                  key={idx_sublink}
                                  href={getHrefFromMenuLink(sublink)}
                                  className="block font-almarose text-white text-[13.89px] leading-[21px] hover:underline"
                                  target={sublink?.url ? '_blank' : '_self'}
                                >
                                  {sublink.title}
                                </a>
                              ))}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </OutsideClickHandler>
        )}
    </>
  )
}

export default Header
