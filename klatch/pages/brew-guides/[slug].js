import React from 'react'
import { useRouter } from 'next/router'

import { getBrewGuide, getAllDocSlugs } from '@data'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import BrewGuide from '@components/brew-guide/brew-guide'

const Page = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const { site, brewGuide } = data
  const seo = brewGuide.seo ? brewGuide.seo : { metaTitle: brewGuide?.name }

  return (
    <>
      {!router.isFallback && (
        <Layout
          site={site}
          page={{
            hasTransparentHeader: false,
            seo,
          }}
        >
          <BrewGuide brewGuide={brewGuide} />
        </Layout>
      )}
    </>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  const pageData = await getBrewGuide(params.slug, {
    active: preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: pageData,
    },
  }
}

export async function getStaticPaths() {
  const allPages = await getAllDocSlugs('brewGuide')

  return {
    paths:
      allPages?.map((page) => {
        return {
          params: {
            slug: page.slug,
          },
        }
      }) || [],
    fallback: false,
  }
}

export default Page
