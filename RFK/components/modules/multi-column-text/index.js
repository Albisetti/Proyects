import React from 'react'
import BlockContent from '@components/block-content'

const MultiColumnText = ({ data = {} }) => {
  const { title, includeTopBorder, textColumns } = data

  return (
    <section className="pt-[35px] md:pt-[69px] pb-[24px] sm:pb-[50px] md:pb-[75px]">
      <div className="container-x">
        {!!includeTopBorder && (
          <div className="w-[72px] h-[3px] rounded-full bg-lightBlue mb-[24px] md:mb-[40px]" />
        )}
        <h2 className="font-almarose text-[31.74px] leading-100 font-bold text-deepBlueDark mb-[26px]">
          {title}
        </h2>

        <div className="flex flex-col md:flex-row gap-[50px] md:gap-[20px] mt-[30px] md:mt-0">
          {textColumns.map((col, idx) => (
            <div key={idx} className="flex-1">
              <BlockContent
                className="font-almarose text-deepBlueDark text-[18.52px] leading-[26.46px] font-normal md:max-w-[470px]"
                blocks={col.content}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MultiColumnText
