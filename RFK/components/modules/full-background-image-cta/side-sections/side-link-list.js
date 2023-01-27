import React from 'react'
import cx from 'classnames'

const SideLinkList = ({ data }) => {
  const { arrows, menu, style, title } = data

  return (
    <div className="px-10 md:my-0 my-25">
      <div className="flex flex-col items-left justify-center h-full w-full">
        <h5 className="font-almarose text-[14px] font-bold leading-[17px] text-poolBlue mb-10">
          {title}
        </h5>
        <ul
          className={cx(
            style === 'default' && 'text-[24px] leading-[26.5px] text-poolBlue',
            style === 'small' && 'text-[14px] leading-[17px]',
            'font-almarose font-bold'
          )}
        >
          {menu.items.map((item, idx) => {
            const linkHref = !!item.page
              ? item.page?.isHome
                ? '/'
                : '/' + item.page.slug
              : !!item.url
              ? item.url
              : '/404'
            return (
              <ul
                key={idx}
                className={cx(
                  style === 'small' && 'my-5',
                  style === 'default' && 'my-15'
                )}
              >
                <a
                  className={cx(
                    style === 'default' &&
                      'text-[24px] leading-[26.5px] text-poolBlue',
                    style === 'small' &&
                      ' text-white text-[14px] leading-[17px]',
                    'font-almarose font-bold hover:text-lightBlue'
                  )}
                  href={linkHref}
                  target="_blank"
                >
                  {arrows && (
                    <div className="font-wingdings inline text-poolBlue">
                      {'\u2B62'}
                    </div>
                  )}{' '}
                  {item.title}
                </a>
              </ul>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SideLinkList
