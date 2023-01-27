import Cookies from 'js-cookie'
import { createContext, useEffect, useState } from 'react'

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([])
  const [menuOpen, setMenuOpen] = useState(undefined)
  const [brandVideo, setBrandVideo] = useState(false)
  const [videoMuted, setVideoMuted] = useState(true)
  const [videoRendering, setVideoRendering] = useState(false)
  const [skyparkVideo, setSkyparkVideo] = useState(false)
  const [skyparkAnim, setSkyparkAnim] = useState(false)

  const [skyparkMobile, setSkyparkMobile] = useState(false)

  const addMenu = (menu) => {
    setMenus([...menus, menu])
  }

  const scrollDisabled = menus.length > 0 || brandVideo || skyparkAnim

  useEffect(() => {
    if (!Cookies.get('playBrandFilm')) {
      setBrandVideo(true)
      Cookies.set('playBrandFilm', '1')
    }
  }, [])

  useEffect(() => {
    const contentContainer = document.getElementById('content')
    const disableScroll = () => {
      contentContainer.style.overflowY = 'hidden'
      if (window.innerWidth >= 768) document.getElementById('content')?.style?.paddingRight = '17px'
    }
    const enableScroll = () => {
      contentContainer.style.overflowY = 'auto'
      if (window.innerWidth >= 768) document.getElementById('content')?.style?.paddingRight = 'unset'
    }

    if (scrollDisabled) {
      disableScroll()
    } else {
      enableScroll()
    }
    setMenuOpen(menus[menus.length - 1])
  }, [menus, brandVideo, skyparkAnim])

  const removeLastMenu = () => {
    setMenus(menus.slice(0, menus.length - 1))
  }

  return (
    <MenuContext.Provider
      value={{
        menus,
        menuOpen,
        brandVideo,
        videoMuted,
        videoRendering,
        skyparkVideo,
        skyparkAnim,
        skyparkMobile,

        addMenu,
        removeLastMenu,
        setBrandVideo,
        setVideoMuted,
        setVideoRendering,
        setSkyparkVideo,
        setSkyparkAnim,
        setSkyparkMobile,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}
