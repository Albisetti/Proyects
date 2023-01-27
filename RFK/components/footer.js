import React from 'react'
import Icon from '@components/icon'
import Menu from '@components/menu'

const Footer = ({ data = {} }) => {
  const { blocks, donationCOTitle, donationCODescription, donationCOLink } =
    data

  const ctaLink =
    donationCOLink?.ctaType === 'internal'
      ? donationCOLink?.hrefInternal
      : donationCOLink?.ctaType === 'external'
      ? donationCOLink?.hrefExternal
      : null

  return (
    <>
      {/* Donations Callout Block */}
      <div className="relative w-full flex justify-center items-center px-[18px] xs:px-[30px] z-[1]">
        <div className="sm:w-[1000px] bg-[#6ECDE6] rounded-b-[60px] flex flex-col sm:flex-row items-center justify-between px-[12px] xxs:px-[26px] sm:px-[55px] py-[25px] sm:py-[45px] mt-[25px] sm:mt-[50px]">
          <div>
            <p className="text-[26px] sm:text-[31.75px] leading-[34px] sm:leading-[38.1px] font-sentinel font-medium text-deepBlueDark mb-[12px]">
              {donationCOTitle || 'Callout about donations'}
            </p>
            <p className="text-[17px] sm:text-[21.17px] leading-[27.78px] font-almarose text-deepBlueLight mb-[30px] sm:mb-[40px]">
              {donationCODescription ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
            </p>
            <a
              className="text-[14px] leading-[16.67px] font-almarose font-bold text-white transition-all duration-300 py-[12px] px-[24px] w-max rounded-[30px] bg-deepBlueDark hover:bg-deepBlueLight"
              href={ctaLink || '/404'}
              target={donationCOLink?.target || '_blank'}
            >
              {donationCOLink?.title || 'Donate Now'} ⭢
            </a>
          </div>
          <img
            src="/donate-logo.png"
            alt=""
            className="w-[127.5px] h-[127.5px] mt-[30px] sm:mt-0 sm:ml-[25px] object-contain"
          />
        </div>
      </div>

      <footer
        className="footer mt-[40px] sm:mt-[70px] py-[10px] bg-deepBlueLight"
        role="contentinfo"
      >
        <img
          src="/waves-bot.png"
          alt=""
          className="hidden md:block absolute w-full h-[20vw] max-h-[330px] translate-y-[-90%] z-[0]"
        />
        <div className="md:grid-rows-2 container-x py-[25px] sm:py-[50px] px-65 divide-y divide-lightGray">
          <div className="md:grid grid-cols-2 gap-x-[160px] justify-around">
            <div className="md:w-[550px]">
              <h4 className="text-poolBlue font-[Sentinel] mb-[10px] md:mb-[25px] font-medium text-[24px]">
                {blocks[0]?.howToReachUsTitle}
              </h4>
              <div className="md:grid gap-x-100 grid-cols-2">
                <div>
                  <div className="text-white font-medium font-almarose text-[11.91px] leading-[18.8px] md:w-[290px]">
                    {blocks[0]?.howToReachUsDescription} <br />
                  </div>
                  <div className="text-white grid grid-flow-col auto-cols-auto gap-x-[10px] mt-[20px] font-almarose text-[11.91px] xs:max-w-[120px] sm:max-w-[120px] md:max-w-[120px]">
                    {blocks[0]?.social?.map((link, key) => {
                      return (
                        <a
                          key={key}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon
                            className="text-white text-[20px]"
                            name={link.icon}
                          />
                        </a>
                      )
                    })}
                  </div>
                </div>
                <div className="md:w-[200px] md:my[0px] my-[50px] md:my-[0px] text-[15.21px] font-almarose">
                  <div className="font-bold text-white">
                    {' '}
                    {blocks[1]?.rfkCommunityAllianceAddressTitle}
                    <p className="text-white font-normal leading-[21.17px]">
                      {blocks[1]?.street} <br />
                      {blocks[1]?.city} <br />
                      {blocks[1]?.phoneNumber} <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-bold md:ml-[20px] mb-[10px] md:mb-[20px] font-almarose text-[15.88px] leading-[20px] text-poolBlue">
                {blocks[2]?.newsLetterTitle}
              </p>
              <p className="text-white md:ml-[20px] font-almarose text-[13px] leading-[18px]">
                {blocks[2]?.newsLetterDescription}{' '}
              </p>
              <div className="flex flex-wrap mt-[15px] md:mt-[0px] gap-x-[2px] font-almarose md:max-w-[575px]">
                <div className="md:mt-[20px]">
                  <input
                    id={`email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="shadow-sm mb-[30px] md:mb-[0px] w-[200px] md:w-[280px] h-[40px] pl-[16px] placeholder:text-placeholderText border-gray-300 rounded-full text-[13.23px] focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    placeholder="Email Address"
                  />
                </div>
                <div className="md:ml-[5px] md:mt-[20px]">
                  <button className="w-[146px] h-[40px] rounded-full text-[13.89px] border border-poolBlue text-poolBlue transition-colors duration-300 bg-transparent hover:bg-poolBlue hover:text-white font-semibold">
                    Sign Up →
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="md:grid grid-cols-7 gap-x-32 mt-30 sm:mt-50 pt-30 sm:pt-50 font-almarose">
            <div className="col-span-2 text-paleBlue">
              <p className="font-almarose text-[11.91px] leading-[25.8px]">
                {blocks[3]?.copyrightTitle} <br />
                {blocks[3]?.taxID} <br />
                <a
                  className="text-white"
                  target="_blank"
                  href={blocks[3]?.termOfUseUrl}
                >
                  Terms of Use
                </a>
                <a
                  target="_blank"
                  href={blocks[3]?.privacyPolicyUrl}
                  className="ml-[35px] text-white"
                >
                  Privacy Policy
                </a>{' '}
                <br />
              </p>
            </div>
            <div className="mt-[30px] md:w-[124px] md:mt-[0px]">
              <div className="font-bold text-[15.88px] mb-[10px] text-poolBlue">
                Find Support
              </div>
              {blocks[4]?.findSupportMenu?.items && (
                <Menu
                  items={blocks[4]?.findSupportMenu?.items}
                  className="text-white text-[11.91px] leading-[15px]"
                />
              )}
            </div>
            <div className="mt-[30px] md:w-[124px] md:mt-[0px]">
              <div className="font-bold text-[15.88px] mb-[10px] text-poolBlue">
                Our Services
              </div>
              {blocks[4]?.ourServicesMenu?.items && (
                <Menu
                  items={blocks[4]?.ourServicesMenu?.items}
                  className="text-white text-[11.91px] leading-[15px]"
                />
              )}
            </div>
            <div className="mt-[30px] md:w-[124px] md:mt-[0px]">
              <div className="font-bold text-[15.88px] mb-[10px] text-poolBlue">
                Our Approach
              </div>
              {blocks[4]?.ourApproachMenu?.items && (
                <Menu
                  items={blocks[4]?.ourApproachMenu?.items}
                  className="text-white text-[11.91px] leading-[15px]"
                />
              )}
              <div className="font-bold text-[15.88px] my-[10px] text-poolBlue">
                About Us
              </div>
              {blocks[4]?.aboutUsMenu?.items && (
                <Menu
                  items={blocks[4]?.aboutUsMenu?.items}
                  className="text-white text-[11.91px] leading-[15px]"
                />
              )}
            </div>
            <div className="mt-[30px] md:w-[124px] md:mt-[0px]">
              <div className="font-bold text-[15.88px] mb-[10px] text-poolBlue">
                News &amp; Events
              </div>
              {blocks[4]?.newsEventsMenu?.items && (
                <Menu
                  items={blocks[4]?.newsEventsMenu?.items}
                  className="text-white text-[11.91px] leading-[15px]"
                />
              )}
            </div>
            <div className="mt-[30px] md:w-[124px] md:mt-[0px]">
              <div className="font-bold text-[15.88px] mb-[10px] text-poolBlue">
                Careers
              </div>
              {blocks[4]?.careersMenu?.items && (
                <Menu
                  items={blocks[4]?.careersMenu?.items}
                  className="text-white text-[11.91px] leading-[15px]"
                />
              )}
              <div className="mt-[30px]" />
              {blocks[4]?.getInvolvedPage && (
                <div className="mb-[20px]">
                  <a
                    href={'/' + blocks[4]?.getInvolvedPage}
                    target="_blank"
                    className="font-bold text-[15.88px] transition-colors duration-300 text-poolBlue hover:text-white"
                  >
                    Get Involved
                  </a>
                </div>
              )}
              {blocks[4]?.contactUsPage && (
                <div>
                  <a
                    href={'/' + blocks[4]?.contactUsPage}
                    target="_blank"
                    className="font-bold text-[15.88px] transition-colors duration-300 text-poolBlue hover:text-white"
                  >
                    Contact Us
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
