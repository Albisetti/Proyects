import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import styles from './styles.module.scss'
import { MenuContext } from '@context/menuContext'
import Cookies from 'js-cookie'

const sections = [
  {
    iconName: 'skypark',
    sectionID: 'elemSkyPark',
    alwaysShown: true,
  },
  { iconName: 'floor', sectionID: 'elemFloor' },
  { iconName: 'amenities', sectionID: 'elemAmenities' },
  { iconName: 'building', sectionID: 'elemBuilding', alwaysShown: true },
  {
    iconName: 'location',
    sectionID: 'elemLocation',
    bottomHidden: true,
  },
  {
    iconName: 'team',
    sectionID: 'elemTeam',
    bottomHidden: true,
  },
]

const VerticalNavigation = ({ data = {} }) => {
  const { setSkyparkMobile, setSkyparkAnim } = useContext(MenuContext)

  const [mainContainer, setMainContainer] = useState()
  const [sectionPositions, setSectionPositions] = useState([])
  const [currentSection, setCurrentSection] = useState('')

  const [hideBottomStep, setHideBottomStep] = useState(false)
  const [scrollPos, setScrollPos] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  const [skyparkEntrance, setSkyparkEntrance] = useState(false)
  const [skyparkAnimDone, setSkyparkAnimDone] = useState(false)

  const [buildingFrame, setBuildingFrame] = useState(1)

  const verticalNavRef = useRef(null)

  const loadBuildingImages = () => {
    const imagesPreload = new Array(151)
      .fill(0)
      .map(
        (_, idx) =>
          `/images/building-frames/frame0${String(idx + 1).padStart(
            3,
            '0'
          )}.jpg`
      )
    imagesPreload.forEach((image) => {
      const newImage = new Image()
      newImage.src = image
      window[image] = newImage
    })
  }

  /* Initial events & states setup */
  useEffect(() => {
    const getSectionPositions = () => {
      const pos = sections
        .map((s) => document.getElementById(s.sectionID))
        .filter((s) => !!s)
        .map((s) => ({
          elemID: s.id,
          pos: s.offsetTop,
          options: sections.find((section) => section.sectionID === s.id),
        }))
        .sort((a, b) => a.pos - b.pos)
        .reverse()
      return pos
    }
    setSectionPositions(getSectionPositions())

    loadBuildingImages()

    document.getElementById('elemLocation').classList.add(styles.elemHidden)
    document.getElementById('elemTeam').classList.add(styles.elemHidden)

    const contentElem = document.getElementById('content')
    if (!mainContainer) setMainContainer(contentElem)

    const scrollFunc = () => onScrollSetPos(contentElem)
    const resizeFunc = () => {
      onResizeSetWidth()
      setSectionPositions(getSectionPositions())
      loadBuildingImages() // Reload building on resize to attempt to avoid flickering
    }
    onResizeSetWidth()

    if (Cookies.get('skyparkAnimDone')) {
      setSkyparkEntrance(true)
      setSkyparkAnimDone(true)
    }

    contentElem.addEventListener('scroll', scrollFunc)
    window.addEventListener('resize', resizeFunc)
    return () => {
      contentElem.removeEventListener('scroll', scrollFunc)
      window.removeEventListener('resize', resizeFunc)
    }
  }, [])

  /* Skypark animation completion listener */
  useEffect(() => {
    if (!verticalNavRef.current) return

    const animDoneFunc = () => setSkyparkAnimDone(true)
    verticalNavRef.current.addEventListener('skyparkAnimDone', animDoneFunc)
    return () => {
      if (!verticalNavRef.current) return
      verticalNavRef.current.removeEventListener(
        'skyparkAnimDone',
        animDoneFunc
      )
    }
  }, [verticalNavRef.current])

  const onScrollSetPos = (container) => {
    setScrollPos(container.scrollTop)
  }

  const onResizeSetWidth = () => {
    setWindowWidth(window.innerWidth)
  }

  /* Section scrolling handler */
  useEffect(() => {
    if (!mainContainer) return

    const scrollPos = mainContainer.scrollTop + window.innerHeight / 2
    const section = sectionPositions.find((s) => s.pos <= scrollPos)

    // Section change
    if (
      section &&
      section !== currentSection &&
      (section.elemID !== 'elemSkyPark' ||
        skyparkEntrance ||
        (section.elemID === 'elemSkyPark' &&
          mainContainer.scrollTop <=
            ((windowWidth || window.innerWidth) >= 768 ? 65 : 120)))
    ) {
      setCurrentSection(section)

      // Section fade animation
      const sectionIdx = sections.indexOf(
        sections.find((s) => s.sectionID === section.elemID)
      )
      sections.forEach((s, idx) => {
        const sectionElemPre = document.getElementById(s.sectionID)
        if (!sectionElemPre) return

        const sectionElem = sectionElemPre.firstChild
        if (!sectionElem) return

        sectionElem.classList.add(styles.containerTransition)

        if (idx === sectionIdx) {
          sectionElem.classList.remove(styles.containerHidden)
          sectionElem.classList.remove(styles.containerTransformDown)
          sectionElem.classList.remove(styles.containerTransformUp)
          return
        }
        sectionElem.classList.add(styles.containerHidden)

        if (idx < sectionIdx) {
          sectionElem.classList.add(styles.containerTransformUp)
          sectionElem.classList.remove(styles.containerTransformDown)
        } else if (idx > sectionIdx) {
          sectionElem.classList.add(styles.containerTransformDown)
          sectionElem.classList.remove(styles.containerTransformUp)
        }
      })

      if (section.elemID === 'elemSkyPark' && !skyparkEntrance) {
        setTimeout(() => {
          setSkyparkEntrance(true)
          setSkyparkAnim(true)
          document
            .getElementById('skyParkContainer')
            .dispatchEvent(new Event('entrance'))
          scrollToSection('elemSkyPark')
        }, 300)
      }

      if (
        (section.elemID !== 'elemBuilding' || Cookies.get('hideBottomStep')) &&
        hideBottomStep === false
      ) {
        Cookies.set('hideBottomStep', '1')
        setHideBottomStep(true)

        setTimeout(() => {
          const positions = sectionPositions

          const locationElem = document.getElementById('elemLocation')
          locationElem.classList.remove(styles.elemHidden)
          positions.find((p) => p.elemID === locationElem.id).pos =
            locationElem.offsetTop

          const teamElem = document.getElementById('elemTeam')
          teamElem.classList.remove(styles.elemHidden)
          positions.find((p) => p.elemID === teamElem.id).pos =
            teamElem.offsetTop

          setSectionPositions(positions.sort((a, b) => a.pos - b.pos).reverse())
        }, 400)
      }
    }

    // Building animation frame
    const endFrame = 139
    const h = mainContainer,
      b = document.body,
      st = 'scrollTop',
      sh = 'scrollHeight',
      spPad = skyparkEntrance ? h.clientHeight - window.innerHeight * 0.2 : 0
    const scrollOffset = window.innerHeight * 0.462
    const frameScrollPerc =
      ((h[st] - scrollOffset || b[st]) - spPad) /
      ((h[sh] - scrollOffset || b[sh]) - h.clientHeight - hideBottomStep
        ? h.clientHeight * 3 - spPad
        : 0)
    setBuildingFrame(
      Math.max(
        1,
        Math.min(endFrame, Math.round(endFrame * (1 - frameScrollPerc)) + 1)
      )
    )
  }, [scrollPos, mainContainer, windowWidth])

  /* Make sure user is in the skypark section when its animation begins */
  useEffect(() => {
    if (
      currentSection.elemID !== 'elemSkyPark' &&
      skyparkEntrance &&
      !skyparkAnimDone
    ) {
      scrollToSection('elemSkyPark')
    }
  }, [currentSection, skyparkEntrance])

  /* Set navbar to light mode when on mobile skypark */
  useEffect(() => {
    if (!windowWidth) return

    setSkyparkMobile(
      currentSection.elemID === 'elemSkyPark' &&
        window.innerWidth <= 768 &&
        skyparkAnimDone
    )
  }, [currentSection, windowWidth, skyparkAnimDone])

  const scrollToSection = (sectionID) => {
    if (!mainContainer) return
    const sectionElem = document.getElementById(sectionID)
    if (sectionElem)
      mainContainer.scrollTo({
        top: sectionElem.offsetTop,
        behavior: 'smooth',
      })
  }

  return (
    <div className={styles.buildingPlaceholder}>
      <div className={styles.sidenav} id="elemVerticalNav" ref={verticalNavRef}>
        <div className={styles.container}>
          {sections.map((s, idx) => (
            <Fragment key={idx}>
              <div
                className={cx('relative group', styles.iconContainer, {
                  invisible: s.bottomHidden && !hideBottomStep,
                })}
                onClick={() => scrollToSection(s.sectionID)}
              >
                <img
                  className={cx('group-hover:opacity-0', styles.icon, {
                    '!opacity-0':
                      (currentSection.elemID !== s.sectionID &&
                        !s.alwaysShown) ||
                      currentSection.elemID === s.sectionID,
                  })}
                  src={`/icons/sidenav/${s.iconName}-white.svg`}
                />
                <img
                  className={cx('group-hover:opacity-100', styles.blueIcon, {
                    '!opacity-0':
                      currentSection.elemID !== s.sectionID && !s.alwaysShown,
                    '!opacity-100': currentSection.elemID === s.sectionID,
                  })}
                  src={`/icons/sidenav/${s.iconName}-navyBlue.svg`}
                />
                <div
                  className={cx(
                    'opacity-100 group-hover:border-navyBlue group-hover:scale-150',
                    styles.unselectedCircle,
                    {
                      '!scale-0':
                        currentSection.elemID === s.sectionID ||
                        s.alwaysShown ||
                        (s.bottomHidden && !hideBottomStep),
                    }
                  )}
                />
              </div>
              {idx !== sections.length - 1 && (
                <div
                  className={cx(
                    styles.separatorLine,
                    'transition-all duration-700',
                    {
                      '!h-0':
                        idx < sections.length - 1 &&
                        sections[idx + 1].bottomHidden &&
                        !hideBottomStep,
                    }
                  )}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div
        className={cx(styles.building, {
          [styles.buildingSkyparkTransition]:
            skyparkEntrance && !skyparkAnimDone,
          [styles.buildingSkyparkTransitioned]: skyparkEntrance,
        })}
      >
        <div
          className={styles.buildingImage}
          style={{
            backgroundImage: `url(/images/building-frames/frame0${String(
              buildingFrame
            ).padStart(3, '0')}.jpg)`,
            backgroundPosition: 'center',
          }}
        />
      </div>
    </div>
  )
}

export default VerticalNavigation
