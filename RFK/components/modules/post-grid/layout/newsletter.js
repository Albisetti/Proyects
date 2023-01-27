import Link from 'next/link'

function NewsletterLayout({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-16">
      {posts?.map((post, index) => (
        <div className="flex flex-col" key={index}>
          <p className="uppercase">
            {new Date(post?.updatedAt).toDateString()}
          </p>
          <h3 className="text-[15.52px] leading-[18.84px]">{post?.title}</h3>
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
      ))}
    </div>
  )
}

export default NewsletterLayout
