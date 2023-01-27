import { getSanityClient } from '@lib/sanity'

import * as queries from './queries'

// Fetch a specific visible post by slug with our global data
export async function getPost(slug, preview) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "post": *[_type == "post" && visibility == "visible" && slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        ${queries.post}
      },
      ${queries.site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

// Fetch all visible posts with our global data
export async function getPosts(preview) {
  const query = `
    {
      "posts": *[_type == "post" && visibility == "visible"] | order(publishedAt desc)[]{
        ${queries.post}
      },
      ${queries.site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

// Fetch all visible events by category with our global data
export async function getPostsByCategory(slug, preview) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "category": *[_type == "postCategory" && slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        ${queries.postCategory}
      },
      "posts": *[_type == "post" && visibility == "visible" && category->slug.current in ${JSON.stringify(
        slugs
      )}] | order(publishedAt desc)[]{
        ${queries.post}
      },
      ${queries.site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}
