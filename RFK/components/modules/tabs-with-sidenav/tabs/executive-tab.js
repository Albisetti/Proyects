import Photo from '@components/photo'
import React from 'react'
import useInView from 'react-cool-inview'
import BlockContent from '@components/block-content'

const ExecutiveTab = ({ tabData }) => {
  const { observe, inView } = useInView({
    unobserveOnEnter: true,
    threshold: 0.1,
  })
  return (
    <div>
      {tabData.staffList.map((staffMember, key) => (
        <div
          key={key}
          className="mb-30 flex flex-col sm:flex-row justify-between"
        >
          <div
            ref={observe}
            className="w-82 h-82 rounded-full flex-shrink-0 mr-25 mb-15"
          >
            <Photo
              photo={staffMember.photo}
              forceLoad={inView}
              rounded={true}
              basicMode={true}
              size={{ width: 82, height: 82 }}
            />
          </div>
          <div>
            <span className="text-deepBlueLight mb-10">
              <h5 className="inline text-[16px] leading-[20px]">
                {staffMember?.name}
              </h5>
              <h6 className="inline text-[12px] leading-[20px] ml-[10px]">
                {staffMember?.jobTitle}
              </h6>
            </span>
            <BlockContent
              className="block-content-tabs-with-sidenav"
              blocks={staffMember?.description}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExecutiveTab
