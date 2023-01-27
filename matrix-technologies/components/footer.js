import React from 'react'
import SocialIcon from './social-icon'
import SanityWidthImage from './sanity-width-image'
const Footer = ({ data = {} }) => {
  const {
    logo,
    hubspotId,
    social: socialLinks,
    linksByCategory: linksByCategory,
    termsOfUse: termsOfUseLink,
  } = data
  console.log(data)
  return (
    <footer className=" xxl:container">
      <section className=" relative flex min-h-[600px] flex-col items-center justify-center bg-darkGray pt-12 pb-6 xl:flex-row xl:items-start xl:justify-start xl:px-36">
        {logo && (
          <div className=" flex flex-col xl:mr-16">
            <div className="w-[352px]">
              <SanityWidthImage
                className="h-auto w-[260px]"
                image={logo}
                alt={logo?.alt}
              />
              <div className="h-[400px] w-[352px] bg-white"></div>
            </div>
          </div>
        )}
        {linksByCategory &&
          linksByCategory?.map((category, key) => (
            <div className="mr-8 hidden min-w-fit gap-4 pt-10 xl:block">
              <a
                key={key}
                target={category.categoryName[0].target}
                href={category.categoryName[0]?.url}
                className="cursor-pointer text-[20px] font-bold text-white hover:text-blue"
              >
                {category.categoryName[0].title}
              </a>
              <div className="flex flex-col">
                {category.linkList?.map((link, key) => (
                  <a
                    key={key}
                    target="_self"
                    href={link?.url}
                    className="mt-4 cursor-pointer text-[16px] font-bold text-white hover:text-blue"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        <div className="right-36 bottom-4 flex-col self-center xl:absolute ">
          <div className="mb-5 mr-8 mt-5 flex xl:mt-0 xl:mr-0 xl:flex-row-reverse">
            {socialLinks?.map((link, key) => (
              <a
                key={key}
                href={link?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-5 p-2 text-white transition-colors duration-300 hover:bg-white hover:text-black "
              >
                <SocialIcon name={link?.icon} className="text-lg" />
              </a>
            ))}
          </div>
          <div className="mr-6 flex flex-col items-center font-bold xl:mr-0 xl:flex-row xl:gap-6 xl:font-normal">
            <div className=" text-[12px] uppercase text-white">
              &copy; {new Date().getFullYear()} MATRIX TECHNOLOGIES, INC
            </div>
            <div className="hidden h-2 w-[2px] bg-white xl:block"></div>
            <div className="text-[12px] uppercase text-white">
              all rights reserved
            </div>
            <a
              target={termsOfUseLink[0].target}
              href={termsOfUseLink[0].url}
              className="mt-5 cursor-pointer text-[12px] uppercase text-white underline xl:mt-0 xl:ml-8"
            >
              {termsOfUseLink[0].title}
            </a>
          </div>
        </div>
      </section>
    </footer>
  )
}

export default Footer
