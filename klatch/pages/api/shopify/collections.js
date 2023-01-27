import axios from 'axios'
import sanityClient from '@sanity/client'
import crypto from 'crypto'
import { nanoid } from 'nanoid'
import path from 'path/posix'
const getRawBody = require('raw-body')
const jsondiffpatch = require('jsondiffpatch')

const sanity = sanityClient({
  dataset: process.env.SANITY_PROJECT_DATASET,
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: false,
})

const shopifyConfig = {
  'Content-Type': 'application/json',
  'X-Shopify-Access-Token': process.env.SHOPIFY_API_PASSWORD,
}

export default async function send(req, res) {
  const id = req.query.id;
  if (!id) return res.status(408).json({ error: 'Invalid Request' })
  
  // Fetch the metafields for this product
  const shopifyCollection = await axios ({
    url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/collections/${req.query.id}.json`,
    method: 'GET',
    headers: shopifyConfig,
  }).then(r => r.data)

  const shopifyProduct = await axios({
    url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/collections/${req.query.id}/products.json`,
    method: 'GET',
    headers: shopifyConfig,
  }).then(res => res.data)

  /*  ------------------------------ */
  /*  Construct our product objects
  /*  ------------------------------ */

  // Define collection document
  const product = {
    _type: 'collection',
    _id: `collection-${id}`,
    title: shopifyCollection.collection.title,
    slug: {
      _type: 'slug',
      current: `c-${id}`
    },
    products: shopifyProduct.products.map(t => ({
      _type: 'reference',
      _key: nanoid(),
      _ref: `product-${t.id}`
    }))
  }
  
  
  let stx = sanity.transaction()

  //stx = stx.delete(`collection-${id}`)
  //const result = await stx.commit()
  //return res.status(200).json(result)
  stx = stx.createIfNotExists(product)

  stx.patch(`collection-${id}`, (patch) =>
    patch.setIfMissing({
      slug: {
        _type: 'slug',
        current: `c-${id}` 
      },
      products: shopifyProduct.products.map(t =>({
        _type: 'reference',
        _key: nanoid(),
        _ref:  `product-${t.id}`
      }))
    })
  )

  const result = await stx.commit()
  console.log('Collection has been updated', id)
  res.status(200)
    .json(result)
}