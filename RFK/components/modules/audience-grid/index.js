import Photo from '@components/photo'
import React from 'react'
import useInView from 'react-cool-inview'
import BlockContent from '@components/block-content'

const AudienceGrid = ({ data = {} }) => {
  const { audiences, backgroundImage } = data
  const { observe, inView } = useInView({
    unobserveOnEnter: true,
    threshold: 0.1,
  })
  return (
    <>
      <div
        className="bg-no-repeat bg-left bg-cover sm:bg-contain"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="container-x grid grid-cols-1 sm:grid-cols-2 gap-x-85 gap-y-30 sm:mt-[100px] my-50">
          {audiences.map((audience) => (
            <div className="w-full">
              <div className="flex justify-between items-end">
                <div>
                  <div className="h-3 w-72 mb-5 bg-lightBlue" />
                  <h2 className="text-deepBlueLight font-almarose font-bold text-[32px] leading-[58px]">
                    {audience.title}
                  </h2>
                </div>
                <div
                  ref={observe}
                  className="w-150 h-150 rounded-full left-[-150px] col-span-1 mb-15 hidden sm:block"
                >
                  <Photo
                    photo={audience.photo}
                    forceLoad={inView}
                    rounded={true}
                    basicMode={true}
                    size={{ width: 150, heigth: 150 }}
                  />
                </div>
              </div>
              <BlockContent
                className="block-content-audience"
                blocks={audience?.description}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AudienceGrid
