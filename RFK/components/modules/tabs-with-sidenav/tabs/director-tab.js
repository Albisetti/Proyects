import React from 'react'

const DirectorTab = ({ tabData }) => {
  return (
    <div className="text-deepBlueLight">
      <p className="text-[14px] leading-[22px] mb-[30px] font-almarose font-medium">
        {tabData?.tabDescription}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {tabData?.columns?.map((column, key) => {
          return (
            <div key={key}>
              {column?.staffList?.map((staffMember, key) => (
                <div className="max-w-[300px] mb-15 font-almarose font-medium">
                  <h5 className="text-[14px] leading-[16px]">
                    {staffMember?.name}
                  </h5>
                  <h6 className="text-[14px] leading-[16px]">
                    {staffMember?.jobTitle}
                  </h6>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DirectorTab
