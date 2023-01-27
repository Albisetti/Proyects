// @ts-ignore
import { isBrowser } from '@lib/helpers'
import Client from 'shopify-buy'

// First, check that Shopify variables are set
const hasShopify = process.env.SHOPIFY_STORE_ID && process.env.SHOPIFY_API_TOKEN

// Warn the client if variables are missing
if (!hasShopify && isBrowser) {
  console.warn('Shopify .env variables are missing')
}

// Otherwise, setup the client and export
const options = {
  domain: `${process.env.SHOPIFY_STORE_ID}.myshopify.com`,
  storefrontAccessToken: isBrowser 
    ? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
    : process.env.SHOPIFY_API_TOKEN,
}

export default hasShopify ? Client.buildClient(options) : null
