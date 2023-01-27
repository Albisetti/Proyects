import Link from 'next/link'
import { imageBuilder } from '@lib/sanity'

function NewsLayout({ posts, category }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16">
        {posts?.map((post, index) => {
          const assetUrl = imageBuilder.image(post?.featuredImage)?.url()

          return (
            <div className="flex" key={index}>
              <img
                src={assetUrl}
                className="w-full h-full aspect-video md:aspect-auto object-cover"
              />
              <div>
                <p className="uppercase">
                  {new Date(post?.updatedAt).toDateString()}
                </p>
                <h3 className="text-[15.52px] leading-[18.84px]">
                  {post?.title}
                </h3>
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
      <div className="flex justify-end">
        <Link
          className="mb-auto"
          href={category ? `/posts/category/${category?.slug}` : '/posts'}
        >
          <a className="transition-all duration-300 w-max group">
            <div className="mt-[14.78px] flex items-center space-x-5">
              <span
                className="text-[15.52px] leading-[18.84px] transition-all duration-300 
              text-deepBlueDark group-hover:text-opacity-70 font-almarose underline"
              >
                {`More ${category ? category?.title : 'Post'}${
                  ['News'].includes(category?.title) ? '' : 's'
                }`}
              </span>
              <span
                className="text-[15.52px] leading-[18.84px] font-almarose transition-all 
                duration-300 group-hover:text-opacity-70 text-deepBlueDark"
              >
                &gt;
              </span>
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default NewsLayout
