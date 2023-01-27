import MenuButton from '@components/menu-button/menu-button'
import NavigationMenu from '@components/navigation-menu/navigation-menu'
import React, { useContext } from 'react'
import { MenuContext } from '@context/menuContext'

import styles from './styles.module.scss'

import cx from 'classnames'

const Header = ({ data = {} }) => {
  const { navMenuImages } = data
  const {
    menuOpen,
    brandVideo,
    skyparkVideo,
    skyparkMobile,
    skyparkAnim,
    videoMuted,
    setVideoMuted,
  } = useContext(MenuContext)

  const videoOpen = brandVideo || skyparkVideo

  return (
    <>
      <NavigationMenu open={menuOpen === 'main-menu'} images={navMenuImages} />
      <header
        className={cx(styles.header, {
          '!bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-transparent':
            skyparkMobile,
        })}
      >
        <div className={cx(styles.headerContent)}>
          <div className="relative flex justify-start items-center">
            <div className={styles.logoImage}>
              <img
                src="/icons/logo-dark.svg"
                alt=""
                className={cx('opacity-100', {
                  '!opacity-0':
                    menuOpen === 'main-menu' || videoOpen || skyparkMobile,
                })}
              />
              <img
                src="/icons/logo-white.svg"
                alt=""
                className={cx('opacity-100', {
                  '!opacity-0':
                    menuOpen !== 'main-menu' && !videoOpen && !skyparkMobile,
                })}
              />
            </div>
            <div
              className={cx(
                'transition-all opacity-100 visible',
                styles.muteButton,
                { '!opacity-0 !invisible': !brandVideo && !skyparkVideo }
              )}
              onClick={() => setVideoMuted(!videoMuted)}
            >
              <img
                src={videoMuted ? '/video-mute.svg' : '/video-unmute.svg'}
                alt=""
              />
            </div>
          </div>

          <MenuButton
            open={menuOpen === 'main-menu'}
            isLight={menuOpen === 'main-menu' || videoOpen || skyparkMobile}
            isVisible={!videoOpen && !skyparkAnim}
          />
        </div>
      </header>
    </>
  )
}

export default Header
