import Link from 'next/link'
import { imageBuilder } from '@lib/sanity'

function CommunityAllianceLayout({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:gap-16">
      {posts?.map((post, index) => {
        const featuredImageUrl = imageBuilder.image(post?.featuredImage)?.url()
        const alternateImageUrl = imageBuilder
          .image(post?.alternateImage)
          ?.url()

        return (
          <div className="flex flex-col" key={index}>
            <img
              src={featuredImageUrl}
              className="w-full h-full aspect-video md:aspect-auto object-cover"
            />
            <div>
              <img src={alternateImageUrl} className="w-[50%] h-auto" />
              <p className="text-[15.52px] leading-[18.84px]">
                {post?.excerpt}
              </p>
              {post?.slug && (
                <Link href={post?.slug}>
                  <a className="transition-all duration-300 w-max group">
                    <div className="mt-[14.78px] flex items-center space-x-5">
                      <span
                        className="text-[15.52px] leading-[18.84px] transition-all duration-300 
                        text-deepBlueDark group-hover:text-opacity-70 font-almarose uppercase"
                      >
                        Read More
                      </span>
                      <span
                        className="text-[15.52px] leading-[18.84px] font-almarose transition-all 
                          duration-300 group-hover:text-opacity-70 text-deepBlueDark "
                      >
                        &gt;
                      </span>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CommunityAllianceLayout
