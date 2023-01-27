import React from 'react'
import cx from 'classnames'

const InternalHero = ({ data = {} }) => {
  const { title, subtitle, backgroundImage } = data

  return (
    <div
      className="min-h-[400px] md:min-h-[645px] text-white bg-center relative bg-no-repeat bg-cover z-[-1]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container-x flex md:items-start items-center">
        <div
          className={cx(
            `relative pt-50 md:pt-170 xl:w-[1266px] opacity-100 z-1 md:pb-0 pb-20`,
            subtitle ? 'md:pt-170' : 'md:pt-230'
          )}
        >
          <h1 className="font-sentinel font-medium text-[60px] md:text-[90px] leading-[72px] md:leading-[108px]  ">
            {title}
          </h1>
          {subtitle && (
            <h2 className="font-almarose font-normal text-[24px] leading-[33px] max-w-[835px]">
              {subtitle}
            </h2>
          )}
        </div>
      </div>
      <div className=" absolute h-full w-full bg-black opacity-30 top-0 " />
    </div>
  )
}

export default InternalHero
