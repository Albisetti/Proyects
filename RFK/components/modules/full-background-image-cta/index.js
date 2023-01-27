import React from 'react'
import CustomLink from '@components/common/custom-link'
import BlockContent from '@components/block-content'
import SideLinkList from './side-sections/side-link-list'
import SideQuoteSlider from './side-sections/side-quote-slider'
import cx from 'classnames'

const FullBackgroundImageCTA = ({ data = {} }) => {
  const { sections } = data

  return (
    <div className="component-spacing text-white">
      {sections.map((section, idx) => {
        const linkHref =
          section.link?.linkType === 'internal'
            ? section.link?.hrefInternal
            : section.link?.linkType === 'external'
            ? section.link?.hrefExternal
            : '/404'
        return (
          <div
            key={idx}
            className={`bg-${section.backgroundColor} md:h-[530px]`}
          >
            <div className="container-x-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3  h-full">
              <div
                className={cx(
                  `bg-cover bg-no-repeat bg-center w-full h-[300px] md:h-full col-span-1 xs:col-span-2 md:col-span-1 hidden xs:block `,
                  section.imageOnTheRight && 'md:order-last'
                )}
                style={{ backgroundImage: `url(${section.image})` }}
              />
              <div className="flex justify-left xs:justify-center items-center px-10 md:my-0 my-25">
                <div className="max-w-[340px] h-[350px] flex flex-col justify-center">
                  <div className="h-3 w-72 mb-20 bg-lightBlue" />
                  <h3 className="font-sentinel font-medium text-[40px] leading-[47px] mb-25">
                    {section.title}
                  </h3>
                  <p className="font-almarose font-normal text-[16px] leading-[24px] mb-auto">
                    {section.description}
                  </p>

                  <div className="flex flex-col mt-auto">
                    <CustomLink
                      className={cx('btn--cta !py-[11px]', {
                        '!border-white hover:!bg-poolBlue hover:!border-poolBlue':
                          section.whiteCTA,
                      })}
                      textClassName={cx({
                        '!text-white': section.whiteCTA,
                      })}
                      title={section?.link?.title}
                      href={linkHref}
                      target={section?.link?.target}
                    />
                  </div>
                </div>
              </div>
              {section.secondarySection === 'linkList' && (
                <SideLinkList data={section.linkList} />
              )}
              {section.secondarySection === 'quoteSlides' && (
                <SideQuoteSlider quoteSlides={section.quoteSlides} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FullBackgroundImageCTA
