import React from 'react'

import { dashify } from 'util/string'

import CtaSection from './cta-section'

const ctaSectionsWithSideNav = ({ data = {} }) => {
  let { sections } = data

  sections = sections.map((section) => {
    return {
      ...section,
      id: dashify(section?.title),
    }
  })

  return (
    <section className="pt-[24px] sm:pt-[36px] md:pt-[90px]">
      <div className="container-x sm:flex h-full">
        <div
          className="w-[150px] md:w-[240px] hidden sm:flex sm:flex-shrink-0 mr-[50px] md:mr-[100px] 
          flex-col border-lightBlue border-t-[3px] pt-[24px] sticky top-[150px] mb-[150px] h-full"
        >
          {sections?.map((section, index) => (
            <a
              key={index}
              href={`#${section?.id}`}
              className="text-lightBlue text-[14px] leading-[24px] hover:font-bold cursor-pointer"
            >
              {section?.title}
            </a>
          ))}
        </div>
        <div className="sm:flex-grow border-lightBlue border-b-[3px] sm:border-none">
          {sections?.map((section, index) => (
            <CtaSection section={section} key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ctaSectionsWithSideNav
