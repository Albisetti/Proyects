import React, { useRef, useState } from 'react'
import cx from 'classnames'
import ExecutiveTab from './tabs/executive-tab'
import DirectorTab from './tabs/director-tab'
import FreeTab from './tabs/free-tab'

const tabsWithSidenav = ({ data = {} }) => {
  const { tabs, darkerBg, title, allVisible } = data

  const [selectedTab, setSelectedTab] = useState(tabs[0])

  const elementRef = useRef()

  const changeTab = (tab) => {
    const targetTab = document.getElementById(tab.tabTitle)
    if (allVisible) {
      if (targetTab) {
        const offset = window.innerWidth < 768 ? 140 : 120
        window.scrollTo({
          top: targetTab.offsetTop - offset,
          behavior: 'smooth',
        })
      }
    } else {
      if (elementRef?.current) {
        elementRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setSelectedTab(tab)
  }

  return (
    <div className={cx({ 'bg-[#F6F6F6]': darkerBg })}>
      {/* Mobile Sticky Navigator */}
      <div className="sm:hidden bg-lightBlue text-white flex justify-start items-center sticky top-[114px] py-[8px] z-[8] overflow-x-scroll">
        {tabs.map((tab, key) => (
          <h6
            key={key}
            className={cx(
              `text-[12px] leading-[14px] cursor-pointer hover:underline px-[10px] text-center`,
              {
                'font-bold': selectedTab.tabTitle === tab.tabTitle,
              }
            )}
            onClick={() => changeTab(tab)}
          >
            {tab.tabTitle}
          </h6>
        ))}
      </div>

      <div
        className="container-x scroll-mt-[115px] pt-[30px] sm:pt-[70px]"
        ref={elementRef}
      >
        {!!title && (
          <>
            <div class="w-[72px] h-[3px] rounded-full bg-lightBlue mb-[20px]"></div>
            <h2 className="font-almarose font-bold text-[32px] leading-[36px] text-deepBlueDark">
              {title}
            </h2>
          </>
        )}
        <div className="flex pt-[35px] sm:pt-[40px] h-full w-full">
          <div
            className={cx(
              'sm:flex hidden w-200 mr-60 flex-col border-lightBlue border-t-[3px] pt-25 sticky top-[150px] h-full',
              { 'mb-[110px]': !allVisible }
            )}
          >
            {tabs.map((tab, key) => (
              <h6
                key={key}
                className={cx(
                  `text-lightBlue text-[12px] leading-[20px] cursor-pointer hover:underline`,
                  {
                    'font-bold': selectedTab.tabTitle === tab.tabTitle,
                  }
                )}
                onClick={() => changeTab(tab)}
              >
                {tab.tabTitle}
              </h6>
            ))}
          </div>
          <div className="w-full border-lightBlue border-t-[3px]">
            {!allVisible && (
              <h2 className="text-deepBlueLight font-almarose font-bold text-[32px] leading-[58px]">
                {selectedTab.tabTitle}
              </h2>
            )}

            {!allVisible && selectedTab._type === 'executiveTab' && (
              <ExecutiveTab tabData={selectedTab} />
            )}
            {!allVisible && selectedTab._type === 'directorTab' && (
              <DirectorTab tabData={selectedTab} />
            )}
            {!allVisible && selectedTab._type === 'freeTab' && (
              <FreeTab tabData={selectedTab} />
            )}

            {allVisible &&
              tabs.map((tab, idx) => (
                <div key={idx} id={tab.tabTitle}>
                  <h2 className="text-deepBlueLight font-almarose font-bold text-[32px] leading-[58px]">
                    {tab.tabTitle}
                  </h2>
                  {tab._type === 'executiveTab' ? (
                    <ExecutiveTab tabData={tab} />
                  ) : tab._type === 'directorTab' ? (
                    <DirectorTab tabData={tab} />
                  ) : (
                    tab._type === 'freeTab' && <FreeTab tabData={tab} />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default tabsWithSidenav
