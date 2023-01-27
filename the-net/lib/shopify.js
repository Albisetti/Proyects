// @ts-ignore
import Client from 'shopify-buy'

// First, check that Shopify variables are set
const hasShopify = process.env.SHOPIFY_STORE_ID && process.env.SHOPIFY_API_TOKEN

// Otherwise, setup the client and export
const options = {
  domain: `${process.env.SHOPIFY_STORE_ID}.myshopify.com`,
  storefrontAccessToken: process.env.SHOPIFY_API_TOKEN,
}

export default hasShopify ? Client.buildClient(options) : null
