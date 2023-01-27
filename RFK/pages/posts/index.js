import React from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'

import { getPosts } from '../../data/posts'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import PostList from '@components/posts/post-list'

const PostIndexPage = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const page = {
    title: 'Posts',
    hasTransparentHeader: false,
    hasLightHeader: false,
  }

  const { site, posts } = data

  return (
    <>
      {!router.isFallback && (
        <Layout site={site} page={page}>
          <PostList posts={posts} />
        </Layout>
      )}
    </>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const data = await getPosts({
    active: preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: data,
    },
    revalidate: 10,
  }
}

export default PostIndexPage
