import React, { useContext, useState } from 'react'
import cx from 'classnames'

import styles from './navigation-menu.module.scss'
import { MenuContext } from '@context/menuContext'

const navOptions = [
  {
    title: 'Sky Park',
    imgProperty: 'imgSkyPark',
    icon: 'skypark-icon',
    elementLinkID: 'elemSkyPark',
  },
  {
    title: 'Floor',
    imgProperty: 'imgFloor',
    icon: 'floor-icon',
    elementLinkID: 'elemFloor',
  },
  {
    title: 'Amenities',
    imgProperty: 'imgAmenities',
    icon: 'amenities-icon',
    elementLinkID: 'elemAmenities',
  },
  {
    title: 'Building',
    imgProperty: 'imgBuilding',
    icon: 'building-icon',
    elementLinkID: 'elemBuilding',
  },
  {
    title: 'Location',
    imgProperty: 'imgLocation',
    icon: 'location-icon',
    elementLinkID: 'elemLocation',
  },
  {
    title: 'Team',
    imgProperty: 'imgTeam',
    icon: 'team-icon',
    elementLinkID: 'elemTeam',
  },
]

const BrandFilmButton = ({ onClick, hidden }) => (
  <div
    onClick={onClick}
    className={cx('group transition-all duration-500', styles.brandFilmButton, {
      hidden: hidden,
      block: !hidden,
    })}
  >
    WATCH BRAND FILM
    <img
      className={`rotate-0 transition-all group-hover:rotate-[-45deg] ${styles.arrowIcon}`}
      src="/icons/selector-arrow-color.svg"
      alt=""
    />
  </div>
)

const NavigationMenu = ({ open, images }) => {
  const [selected, setSelected] = useState(0)
  const { removeLastMenu, setBrandVideo, skyparkAnim, videoRendering } =
    useContext(MenuContext)

  const playBrandFilm = () => {
    setBrandVideo(true)
  }

  const scrollToElem = (target) => {
    const elem = document.getElementById(target)
    if (!elem) return

    document.getElementById('content')?.scrollTo({ top: elem.offsetTop })
  }

  return (
    <div
      className={`${styles.navMenuWrapper} ${
        open && !skyparkAnim ? styles.navMenuWrapperVisible : ''
      }`}
    >
      <div
        className={cx(
          'hidden sm:block transition-transform duration-[1.75s] translate-y-[20px]',
          { '!translate-y-0': open }
        )}
      >
        <div className={styles.linkImageContainer}>
          {navOptions
            .filter((opt) => images.hasOwnProperty(opt.imgProperty))
            .map((opt, idx) => (
              <img
                key={idx}
                src={images[opt.imgProperty]}
                alt=""
                className={cx(styles.linkImage, {
                  'opacity-0 z-0': selected !== idx,
                  'opacity-100 z-[1]': selected === idx,
                })}
              />
            ))}
        </div>
        <BrandFilmButton
          hidden={videoRendering}
          onClick={() => playBrandFilm()}
        />
      </div>
      <div
        className={cx(
          styles.linkList,
          'transition-transform duration-[1.75s] translate-y-[20px]',
          { '!translate-y-0': open }
        )}
      >
        {navOptions.map((opt, idx) => (
          <div
            key={idx}
            className={styles.linkItemContainer}
            onMouseOver={() => setSelected(idx)}
          >
            <span
              className={cx(styles.linkItemLineContainer, 'hidden sm:flex')}
            >
              <span
                className={cx(styles.linkItemLineFill, {
                  [styles.linkItemLineFillSelected]: selected === idx,
                })}
              />
            </span>
            <div
              className={styles.linkTextContainer}
              onClick={() => {
                scrollToElem(opt.elementLinkID)
                removeLastMenu()
              }}
            >
              <div className={styles.linkIcon}>
                <img
                  src={`/icons/menunav/${opt.icon}-gold.svg`}
                  alt=""
                  className={cx(styles.linkIconImg, {
                    'opacity-0': selected !== idx,
                    'opacity-100': selected === idx,
                  })}
                />
                <img
                  src={`/icons/menunav/${opt.icon}-blue.svg`}
                  alt=""
                  className={cx(styles.linkIconImg, {
                    'opacity-0': selected === idx,
                    'opacity-100': selected !== idx,
                  })}
                />
              </div>
              <p
                className={cx(styles.linkItem, {
                  [styles.linkItemSelected]: selected === idx,
                })}
              >
                {opt.title}
              </p>
            </div>
          </div>
        ))}
        <div className="sm:hidden">
          <BrandFilmButton
            hidden={videoRendering}
            onClick={() => playBrandFilm()}
          />
        </div>
      </div>
    </div>
  )
}

export default NavigationMenu
