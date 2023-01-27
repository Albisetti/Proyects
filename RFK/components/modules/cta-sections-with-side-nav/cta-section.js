import React from 'react'
import CustomLink from '@components/common/custom-link'

import { useWindowSize } from '@lib/helpers'

function ctaTitle(title) {
  return (
    <h2 className="text-deepBlueLight font-almarose font-bold text-[24px] leading-[26px] md:text-[32px] md:leading-[34px]">
      {title}
    </h2>
  )
}

function ctaItem(item, index) {
  return (
    <div
      className="flex flex-col space-y-[24px] sm:flex-row sm:space-x-[30px] lg:space-x-[90px] sm:space-y-0 mt-[34px] md:mt-[44px]"
      key={index}
    >
      <img
        className="w-[125px] h-[125px] md:w-[175px] md:h-[175px] lg:ml-40 aspect-square object-cover object-center rounded-full"
        src={item?.image?.url}
        alt={item?.image?.alt}
      />
      <div>
        <h3 className="text-deepBlueLight font-almarose font-bold text-[18px] leading-[26px]">
          {item?.title}
        </h3>
        <p className="text-deepBlueLight font-almarose text-[14px] md:leading-[24px] md:text-[16px]">
          {item?.description}
        </p>
        <div className="flex flex-col">
          <CustomLink
            className="btn--cta"
            title={item?.link?.title}
            href={item?.link?.url}
            target={item?.link?.target}
          />
        </div>
      </div>
    </div>
  )
}

function ctaSection({ section }) {
  const { width } = useWindowSize()

  const isTablet = width >= 768

  return (
    <div
      id={section?.id}
      className="border-lightBlue border-t-[3px] py-[18px] sm:py-[24px] md:pt-[24px] md:pb-[44px] scroll-mt-[150px]"
    >
      {isTablet ? (
        <>
          {ctaTitle(section?.title)}
          {section?.items?.map((item, index) => ctaItem(item, index))}
        </>
      ) : (
        <details className="cta-section">
          <summary>{ctaTitle(section?.title)}</summary>
          {section?.items?.map((item, index) => ctaItem(item, index))}
        </details>
      )}
    </div>
  )
}

export default ctaSection
