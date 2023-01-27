import { useState } from 'react'
import Link from 'next/link'
import cx from 'classnames'

import styles from './navigation-mobile.module.scss'

function NavigationMobile({ mainMenu, open = false, setOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(
    new Array(mainMenu?.items?.length).fill(false)
  )

  const toggleDropdownByIndex = (index) => {
    setDropdownOpen((dropdownArray) => {
      const array = dropdownArray.slice()
      array[index] = !array[index]
      return array
    })
  }

  return (
    <nav
      className={cx(styles.navigation, { [styles.navigationOpen]: open })}
      role="navigation"
    >
      <div className={styles.closeContainer}>
        <svg
          viewBox="0 0 460.775 460.775"
          className={styles.close}
          onClick={() => setOpen(false)}
        >
          <path d="M285.08 230.397 456.218 59.27c6.076-6.077 6.076-15.911 0-21.986L423.511 4.565a15.55 15.55 0 0 0-21.985 0l-171.138 171.14L59.25 4.565a15.551 15.551 0 0 0-21.985 0L4.558 37.284c-6.077 6.075-6.077 15.909 0 21.986l171.138 171.128L4.575 401.505c-6.074 6.077-6.074 15.911 0 21.986l32.709 32.719a15.555 15.555 0 0 0 21.986 0l171.117-171.12 171.118 171.12a15.551 15.551 0 0 0 21.985 0l32.709-32.719c6.074-6.075 6.074-15.909 0-21.986L285.08 230.397z" />
        </svg>
      </div>
      {mainMenu?.items && (
        <ul className={styles.mainMenu}>
          {mainMenu?.items?.map((item, index) => (
            <li key={index}>
              {item.slug ? (
                <Link href={`/${item?.slug}`} passHref>
                  <a>{item?.title}</a>
                </Link>
              ) : (
                <span>{item?.title}</span>
              )}
              {item.dropdownItems && (
                <>
                  <ul
                    className={cx({
                      [styles.dropdownOpen]: dropdownOpen[index],
                    })}
                  >
                    {item.dropdownItems.map((item, index) => (
                      <li key={index}>
                        <Link href={`/${item?.slug}`} passHref>
                          <a>{item?.title}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <svg
                    viewBox="0 0 1024 1024"
                    className={cx(styles.dropdownIcon, {
                      [styles.dropdownIconOpen]: dropdownOpen[index],
                    })}
                    onClick={() => toggleDropdownByIndex(index)}
                  >
                    <path d="M271.653 1023.192c-8.685 0-17.573-3.432-24.238-10.097-13.33-13.33-13.33-35.144 0-48.474L703.67 508.163 254.08 58.573c-13.33-13.331-13.33-35.145 0-48.475 13.33-13.33 35.143-13.33 48.473 0L776.38 483.925c13.33 13.33 13.33 35.143 0 48.473l-480.492 480.694c-6.665 6.665-15.551 10.099-24.236 10.099z" />
                  </svg>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default NavigationMobile
