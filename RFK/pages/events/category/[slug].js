import React from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'

import { getAllDocSlugs } from '@data'
import { getEventsByCategory } from '../../../data/events'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import EventList from '@components/events/event-list'

const EventCategoryPage = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const { site, category, events } = data

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
          <EventList events={events} />
        </Layout>
      )}
    </>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  const data = await getEventsByCategory(params.slug, {
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
  const allCategories = await getAllDocSlugs('eventCategory')

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

export default EventCategoryPage
