import React from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'

import { getEvents } from '../../data/events'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import EventList from '@components/events/event-list'

const EventIndexPage = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const page = {
    title: 'Events',
    hasTransparentHeader: false,
    hasLightHeader: false,
  }

  const { site, events } = data

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

export async function getStaticProps({ preview, previewData }) {
  const data = await getEvents({
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

export default EventIndexPage
