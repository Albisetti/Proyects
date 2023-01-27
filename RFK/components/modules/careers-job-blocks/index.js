import Link from 'next/link'
import React from 'react'

const JobBlock = (block, idx) => (
  <div
    key={idx}
    className="relative w-auto col-span-1 h-[231px] mt-[60px] bg-white p-[38px] pt-[72px]"
  >
    <img
      src={block.image || '/images/careers-page/bg-camera.png'}
      alt=""
      className="absolute w-[123.5px] h-[123.5px] rounded-full top-0 translate-y-[-50%] left-[50%] translate-x-[-50%] object-cover"
    />
    {!!block.title && (
      <p className="font-almarose font-bold text-[23.6px] leading-[23px] text-deepBlueLight mb-[28px]">
        {block.title}
      </p>
    )}
    {!!block.description && (
      <p className="font-almarose font-semibold text-[13.77px] leading-[21.63px] text-deepBlueLight max-w-[230px] mb-[16px]">
        {block.description}
      </p>
    )}
    {!!block.jobLink && (
      <div className="w-fit flex group">
        <Link
          href={
            block.jobLink.ctaType === 'external'
              ? block.jobLink.hrefExternal
              : block.jobLink.hrefInternal
          }
        >
          <a
            target={block.jobLink.target}
            className="font-almarose text-[13.77px] leading-[22.29px] text-lightBlue group-hover:text-royalBlue transition-colors duration-300 font-bold"
          >
            {block.jobLink.title}
            <span className="font-wingdings text-[13.77px] leading-[22.29px] text-lightBlue group-hover:text-royalBlue transition-colors duration-300 font-bold ml-[5px]">
              {'\u2B62'}
            </span>
          </a>
        </Link>
      </div>
    )}
  </div>
)

const CareersJobBlocks = ({ data = {} }) => {
  const { jobBlocks } = data

  return (
    <div className="w-full bg-lightBlue pt-[30px] pb-[100px]">
      <div className="container-x grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-x-[18px] gap-y-[35px]">
        {jobBlocks.map(JobBlock)}
      </div>
    </div>
  )
}

export default CareersJobBlocks
