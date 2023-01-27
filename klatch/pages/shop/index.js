import React from 'react'
import Error from 'next/error'

import { getAllProducts, getStaticPage, queries } from '@data'

import Layout from '@components/layout'
import { Module } from '@components/modules'
import { allProducts } from 'data/queries'

const Shop = ({ data,products }) => {
  const { site, page } = data

  if (!page) {
    return (
      <Error
        title={`"Shop Page" is not set in Sanity, or the page data is missing`}
        statusCode="Data Error"
      />
    )
  }

  return (
    <Layout site={site} page={page}>
      {page.modules?.map((module, key) => (
        <Module
          key={key}
          index={key}
          module={module}
          products={products}
          collectionProducts={page.products}
        />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const shopData = await getStaticPage(
    `
    *[_type == "collection" && _id == ${
      queries.shopID
    }] | order(_updatedAt desc)[0]{
      modules[]{
        ${queries.modules}
      },
      products[wasDeleted != true && isDraft != true${
        preview?.active ? ' && _id in path("drafts.**")' : ''
      }]->${queries.product},
      title,
      seo
    }
  `,
    {
      active: preview,
      token: previewData?.token,
    }
  )

   const data = await getAllProducts();
  return {
    props: {
      products:data,
      data: shopData,
    },
  }
}

export default Shop
