import React, { useState } from 'react'
import Link from 'next/link'

import TruePagination from '../true-pagination'
import { imageBuilder } from '@lib/sanity'

function PostList({ posts }) {
  const postsPerPage = 1
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPosts, setCurrentPosts] = useState(posts.slice(0, postsPerPage))

  const paginatePagePosts = (pageNumberParam) => {
    window.scrollTo({ top, behavior: 'smooth' })
    setCurrentPage(pageNumberParam)
    const pagePosts = posts.slice(
      postsPerPage * pageNumberParam - postsPerPage,
      postsPerPage * pageNumberParam
    )
    setCurrentPosts(pagePosts)
  }

  return (
    <section>
      <div className="container pt-55">
        {currentPosts?.length === 0 && <p>No posts to show.</p>}

        {currentPosts?.map((post, index) => {
          const assetUrl = imageBuilder.image(post?.featuredImage)?.url()

          return (
            <div className="mt-[40px]" key={index}>
              <p className="uppercase">{post?.category?.title}</p>
              <h2>{post?.title}</h2>
              <p>{new Date(post?.publishedAt).toDateString()}</p>
              <p>{post?.excerpt}</p>
              <img
                src={assetUrl}
                className="w-[175px] h-[175px] aspect-square object-cover object-center rounded-full "
              />
              <Link href={`/${post?._type}s/${post?.slug}`}>
                <a className="text-[15.52px] leading-[18.84px] transition-all duration-300 text-deepBlueDark group-hover:text-opacity-70 font-almarose underline">
                  Read More
                </a>
              </Link>
            </div>
          )
        })}
        <TruePagination
          currentPage={currentPage}
          totalPageCount={Math.floor(posts.length / postsPerPage)}
          siblingCount={1}
          onPageChange={(page) => paginatePagePosts(page)}
        />
      </div>
    </section>
  )
}

export default PostList
