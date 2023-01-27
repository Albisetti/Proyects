import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'

import { useClickOutside } from 'util/click-outside'
import { isMenuItemActive, hasActiveDropdownItem } from 'util/navigation'

import styles from './navigation-desktop.module.scss'

function NavigationDesktop({ mainMenu }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownIndex, setDropdownIndex] = useState(-1)
  const router = useRouter()
  const dropdownRef = useRef()
  useClickOutside(dropdownRef, () => setDropdownOpen(false))

  const openDropdown = (index) => {
    setDropdownIndex(index)
    setDropdownOpen(true)
  }

  return (
    <nav role="navigation" className={styles.headerNavigation}>
      {mainMenu?.items && (
        <ul>
          {mainMenu.items.map((item, index) => {
            const activeDropdownItem = hasActiveDropdownItem(
              router.asPath,
              item
            )

            return (
              <li
                className={cx(styles.headerLink, {
                  [styles.isDropdownOpen]:
                    dropdownOpen && dropdownIndex === index
                      ? true
                      : dropdownOpen && dropdownIndex !== index
                      ? false
                      : activeDropdownItem,
                  [styles.isActive]:
                    isMenuItemActive(router.asPath, item?.slug) ||
                    activeDropdownItem,
                })}
                key={index}
              >
                {item.slug ? (
                  <Link href={`/${item?.slug}`}>
                    <a onMouseEnter={() => openDropdown(index)}>
                      {item?.title}
                    </a>
                  </Link>
                ) : (
                  <span onMouseEnter={() => openDropdown(index)}>
                    {item?.title}
                  </span>
                )}
                {item.dropdownItems && (
                  <ul
                    ref={dropdownRef}
                    className={styles.headerDropdown}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    {item.dropdownItems.map((item, index) => (
                      <li
                        className={cx(styles.headerDropdownLink, {
                          [styles.isActive]: isMenuItemActive(
                            router.asPath,
                            item?.slug
                          ),
                        })}
                        key={index}
                      >
                        <Link href={`/${item?.slug}`}>
                          <a>{item?.title}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}

export default NavigationDesktop
