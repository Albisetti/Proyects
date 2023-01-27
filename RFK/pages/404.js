import React from 'react'
import Error from 'next/error'

import { getStaticPage, queries } from '@data'
import { errorID } from 'data/utils'

import Layout from '@components/layout'
import { Module } from '@components/modules'

const NotFoundPage = ({ data }) => {
  const { site, menus, page } = data

  if (!page) {
    return (
      <Error
        title={`"Error Page (404)" is not set in Sanity, or the page data is missing`}
        statusCode="Data Error"
      />
    )
  }

  return (
    <Layout site={site} menus={menus} page={page}>
      {page.modules?.map((module, key) => (
        <Module key={key} index={key} module={module} />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const pageData = await getStaticPage(
    `
    *[_type == "page" && _id == ${errorID}] | order(_updatedAt desc)[0]{
      hasTransparentHeader,
      hasLightHeader,
      modules[]{
        ${queries.modules}
      },
      title,
      seo
    }
  `,
    {
      active: preview,
      token: previewData?.token,
    }
  )

  return {
    props: {
      data: pageData,
    },
  }
}

export default NotFoundPage
