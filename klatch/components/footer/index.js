import Link from 'next/link'
import cx from 'classnames'

import { useWindowSizeAdjustments } from 'util/window-resize'

import style from './footer.module.scss'

const Footer = ({ data = {} }) => {
  const { image, menu, social } = data

  const { windowWidth } = useWindowSizeAdjustments()

  return (
    <footer className={style.footerContainer} role="contentinfo">
      {windowWidth >= 1024 && (
        <div className={style.beansContainer}>
          <img src={image.url} className={style.beansImg} />
        </div>
      )}
      <div className={style.linksContainer}>
        <nav>
          <ul className={style.navContainer}>
            {menu.items.map((item, k) => {
              return (
                <li key={`footer-nav-${k}`}>
                  <Link href={`/${item.slug}`}>
                    <a>{item.title}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <ul className={style.socialContainer}>
          {social.map((item, k) => {
            return (
              <li key={`footer-social-${k}`}>
                <Link href={item.url}>
                  <a target="_blank">
                    <img
                      src={`/icons/${item.title.toLowerCase()}.svg`}
                      className={cx(
                        style.socialIcon,
                        style[`icon${item.title}`]
                      )}
                    />
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}

export default Footer
