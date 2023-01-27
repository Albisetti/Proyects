import React from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'

import { getAllVisibleDocSlugs } from '@data'
import { getEvent } from '../../data/events'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import Event from '@components/events/event'

const EventPage = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const { site, event } = data

  const page = {
    title: event.title,
    hasTransparentHeader: false,
    hasLightHeader: false,
    seo: event.seo,
  }

  return (
    <>
      {!router.isFallback && (
        <Layout site={site} page={page}>
          <Event event={event} />
        </Layout>
      )}
    </>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  const data = await getEvent(params.slug, {
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
  const allEvents = await getAllVisibleDocSlugs('event')

  return {
    paths:
      allEvents?.map((event) => {
        return {
          params: {
            slug: event.slug,
          },
        }
      }) || [],
    fallback: false,
  }
}

export default EventPage
