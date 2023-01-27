import React from 'react'
import CustomLink from '@components/common/custom-link'
import { headerHeight } from '@components/header'

const Hero = ({ data = {} }) => {
  return (
    <div
      className="relative pt-[90px] pb-[150px] xl:pb-[220px] overflow-hidden z-[0]"
      style={{
        backgroundImage: `url("images/home-page/heroImage.png")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="container-x">
        <div>
          <div className={data?.topNavSpace ? headerHeight : ''} />
          <div className="flex flex-col">
            <p className="text-white whitespace-pre-line is-h1 max-w-[570px]">
              {' '}
              {data?.title}
            </p>
            <p className="text-white whitespace-pre-line is-h1 mt-25 max-w-[570px]">
              {' '}
              {data?.subtitle}
            </p>
            <p className="text-white font-almarose  whitespace-pre-line mt-25 text-21 leading-[29px] max-w-[380px]">
              {data?.content}
            </p>
            <CustomLink
              title={data.cta.title}
              href={
                data?.cta?.ctaType === 'external'
                  ? data?.cta?.hrefExternal
                  : '/' + data?.cta?.hrefInternal
              }
              target={data.cta.target}
            />
          </div>
          <img
            className="absolute right-[-9%] bottom-[4%] max-w-[50.13%]"
            src={data?.rightImg?.url}
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
