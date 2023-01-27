import React from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'

import { getAllDocSlugs } from '@data'
import { getPostsByCategory } from '../../../data/posts'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import PostList from '@components/posts/post-list'

const PostCategoryPage = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const { site, category, posts } = data

  const page = {
    title: category.title,
    hasTransparentHeader: false,
    hasLightHeader: false,
    seo: category.seo,
  }

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

export async function getStaticProps({ params, preview, previewData }) {
  const data = await getPostsByCategory(params.slug, {
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
  const allCategories = await getAllDocSlugs('postCategory')

  return {
    paths:
      allCategories?.map((category) => {
        return {
          params: {
            slug: category.slug,
          },
        }
      }) || [],
    fallback: false,
  }
}

export default PostCategoryPage
