import React from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'

import { getAllVisibleDocSlugs } from '@data'
import { getPost } from '../../data/posts'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import Post from '@components/posts/post'

const PostPage = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const { site, post } = data

  const page = {
    title: post.title,
    hasTransparentHeader: false,
    hasLightHeader: false,
    seo: post.seo,
  }

  return (
    <>
      {!router.isFallback && (
        <Layout site={site} page={page}>
          <Post post={post} />
        </Layout>
      )}
    </>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  const data = await getPost(params.slug, {
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

export async function getStaticPaths() {
  const allPosts = await getAllVisibleDocSlugs('post')

  return {
    paths:
      allPosts?.map((post) => {
        return {
          params: {
            slug: post.slug,
          },
        }
      }) || [],
    fallback: false,
  }
}

export default PostPage
