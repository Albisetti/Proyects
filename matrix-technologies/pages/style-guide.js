import React from 'react'
import Error from 'next/error'

import { homeID } from 'data/utils'
import { getStaticPage, queries } from '@data'

import Layout from '@components/layout'
import StyleGuide from '@components/style-guide'

const StyleGuidePage = ({ data }) => {
  const { site, page } = data

  if (!page) {
    return (
      <Error
        title={`"Home Page" is not set in Sanity, or the page data is missing`}
        statusCode="Data Error"
      />
    )
  }

  return (
    <Layout site={site} page={page}>
      <StyleGuide />
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const pageData = await getStaticPage(
    `
    *[_type == "page" && _id == ${homeID}] | order(_updatedAt desc)[0]{
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

export default StyleGuidePage
