import { getSanityClient } from '@lib/sanity'
import * as queries from './queries'

// Fetch all dynamic docs
export async function getAllDocSlugs(doc, slugRoute) {
  const data = await getSanityClient().fetch(
    `*[_type == "${doc}" && !(_id in [${queries.homeID}, ${queries.shopID}, ${
      queries.errorID
    }]) && wasDeleted != true && isDraft != true]{ "slug": ${
      slugRoute || 'slug.current'
    } }`
  )
  return data
}

// Fetch all our page redirects
export async function getAllRedirects() {
  const data = await getSanityClient().fetch(
    `*[_type == "redirect"]{ from, to }`
  )
  return data
}

// Fetch a static page with our global data
export async function getStaticPage(pageData, preview) {
  const query = `
  {
    "page": ${pageData},
    ${queries.site}
  }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

// Fetch a specific dynamic page with our global data
export async function getPage(slug, preview) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "page": *[_type == "page" && slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        hasTransparentHeader,
        modules[]{
          ${queries.modules}
        },
        title,
        seo
      },
      ${queries.site}
    }
    `
  const data = await getSanityClient(preview).fetch(query)

  return data
}

// Fetch a specific brew guide with our global data
export async function getBrewGuide(slug, preview) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "brewGuide": *[_type == "brewGuide" && slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        ${queries.brewGuide}
      },
      ${queries.site}
    }
    `
  const data = await getSanityClient(preview).fetch(query)

  return data
}

// Fetch a specific training class with our global data
export async function getTrainingClass(slug, preview) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "trainingClass": *[_type == "trainingClass" && classProduct->slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        ${queries.trainingClass}
      },
      ${queries.site}
    }
    `
  const data = await getSanityClient(preview).fetch(query)

  return data
}

//Fetch all products
export async function getAllProducts() {
  const data = await getSanityClient().fetch(
    `*[_type == 'product' && wasDeleted != true && isDraft != true]${queries.product}`
  )
  return data
}

// Fetch a specific product with our global data
export async function getProduct(slug, preview) {
  const query = `
    {
      "page": *[_type == "product" && slug.current == "${slug}" && wasDeleted != true && isDraft != true] | order(_updatedAt desc)[0]{
        hasTransparentHeader,
        modules[]{
          ${queries.modules}
        },
        "product": ${queries.product},
        title,
        seo
      },
      ${queries.site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

// Fetch a specific collection with our global data
export async function getCollection(slug, preview) {
  const query = `
    {
      "page": *[_type == "collection" && slug.current == "${slug}"] | order(_updatedAt desc)[0]{
        hasTransparentHeader,
        modules[]{
          ${queries.modules}
        },
        products[wasDeleted != true && isDraft != true${
          preview?.active ? ' && _id in path("drafts.**")' : ''
        }]->${queries.product},
        title,
        seo
      },
      ${queries.site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

export { queries }
