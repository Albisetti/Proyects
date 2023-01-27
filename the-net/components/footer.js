import React from 'react'

import Newsletter from '@components/newsletter'
import Menu from '@components/menu'
import Icon from '@components/icon'

const Footer = ({ data = {} }) => {
  if (data) {
    const { blocks } = data
    return (
      <footer className="footer" role="contentinfo">
        <div className="footer--grid">
          {blocks.map((block, key) => (
            <div key={key} className="footer--block">
              {block.title && <p className="is-h3">{block.title}</p>}

              {block.menu?.items && (
                <Menu items={block.menu.items} className="menu-footer" />
              )}

              {block.newsletter && <Newsletter data={block.newsletter} />}

              {block.social && (
                <div className="menu-social">
                  {block.social.map((link, key) => {
                    return (
                      <a
                        key={key}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name={link.icon} />
                      </a>
                    )
                  })}
                </div>
              )}

              {/* Put our extras in the last block */}
              {key === 3 && (
                <div className="footer--extras">
                  <div className="footer--disclaimer">
                    <p>
                      &copy; {new Date().getFullYear()}. All Rights Reserved.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </footer>
    )
  } else {
    return (
      <footer className="text-center font-bold py-25 ">
        Footer needs setup, please go to sanity dashboard desk/settings/footer
        to configure
      </footer>
    )
  }
}

export default Footer
