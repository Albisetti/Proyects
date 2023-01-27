import { getHrefFromMenuLink } from '@components/header'
import React from 'react'

const ColumnsWithLinks = ({ data = {} }) => {
  const { title, columns } = data

  return (
    <div className="container-x pt-[71px] pb-[50px]">
      <div className="w-[72px] h-[3px] rounded-full mb-[22px] bg-lightBlue" />
      <p className="font-almarose text-[31.74px] leading-[22.48px] font-bold text-deepBlueLight mb-[50px]">
        {title}
      </p>

      <div className="flex w-full justify-start flex-wrap">
        {columns.map((col, idx_col) => (
          <div key={idx_col} className="w-full sm:w-1/3 pr-[12px]">
            {!!col.linkItems &&
              col.linkItems.map((colItem, idx_colitem) => (
                <div key={idx_colitem} className="mb-[19px]">
                  <p className="font-almarose font-bold text-lightBlue text-[19.84px] leading-[26px]">
                    {colItem.title}
                  </p>
                  {!!colItem.menu &&
                    colItem.menu.items.map((sublink, idx_sublink) => (
                      <a
                        key={idx_sublink}
                        href={getHrefFromMenuLink(sublink)}
                        className="block font-almarose text-deepBlueLight text-[15.87px] leading-[30px] hover:underline max-w-[300px] w-fit"
                        target={sublink?.url ? '_blank' : '_self'}
                      >
                        {sublink.title}
                      </a>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ColumnsWithLinks
