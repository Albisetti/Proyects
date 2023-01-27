import React, { useContext } from 'react'

import styles from './styles.module.scss'
import cx from 'classnames'

import { MenuContext } from '@context/menuContext'

const MenuButton = ({ open, isLight, isVisible }) => {
  const { menus, removeLastMenu, addMenu } = useContext(MenuContext)
  const toggled = menus.length || !!open

  return (
    <div
      className={cx(
        'transition-all duration-500',
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      )}
      onClick={() => (menus.length ? removeLastMenu() : addMenu('main-menu'))}
    >
      <div
        className={`group cursor-pointer flex flex-col items-center ${styles.menuButtonContainer}`}
      >
        <div className={styles.menuButton}>
          <div
            className={cx(
              styles.menuButtonLine,
              'absolute transition-transform duration-500',
              styles.lineTopLeft,
              isLight ? 'bg-white' : 'bg-navyBlue',
              toggled ? 'rotate-[28deg]' : 'rotate-[-28deg]'
            )}
          />
          <div
            className={cx(
              styles.menuButtonLine,
              'absolute transition-transform duration-500',
              styles.lineTopRight,
              isLight ? 'bg-white' : 'bg-navyBlue',
              toggled ? 'rotate-[-28deg]' : 'rotate-[28deg]'
            )}
          />
          <div
            className={cx(
              styles.menuButtonLine,
              'absolute transition-transform duration-500',
              styles.lineBottomLeft,
              isLight ? 'bg-white' : 'bg-navyBlue',
              toggled ? 'rotate-[-28deg]' : 'rotate-[28deg]'
            )}
          />
          <div
            className={cx(
              styles.menuButtonLine,
              'absolute transition-transform duration-500',
              styles.lineBottomRight,
              isLight ? 'bg-white' : 'bg-navyBlue',
              toggled ? 'rotate-[28deg]' : 'rotate-[-28deg]'
            )}
          />
        </div>
        <h4
          className={`select-none	 ${styles.menuText} ${
            isLight ? '!text-white' : ''
          }`}
        >
          {toggled ? 'close' : 'menu'}
        </h4>
      </div>
    </div>
  )
}

export default MenuButton
