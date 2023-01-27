import React from 'react'
import { useRouter } from 'next/router'

import { getAllDocSlugs, getTrainingClass } from '@data'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import TrainingClass from '@components/training-class/training-class'

const Page = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const { site, trainingClass } = data
  const seo = trainingClass.seo
    ? trainingClass.seo
    : { metaTitle: trainingClass?.title }

  return (
    <>
      {!router.isFallback && (
        <Layout site={site} page={{ hasTransparentHeader: false, seo }}>
          <TrainingClass trainingClass={trainingClass} />
        </Layout>
      )}
    </>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  const pageData = await getTrainingClass(params.slug, {
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
  const allPages = await getAllDocSlugs(
    'trainingClass',
    'classProduct->slug.current'
  )

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
