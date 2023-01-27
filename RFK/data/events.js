import { getSanityClient } from '@lib/sanity'

import * as queries from './queries'

// Fetch a specific visible event by slug with our global data
export async function getEvent(slug, preview) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "event": *[_type == "event" && visibility == "visible" && slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        ${queries.event}
      },
      ${queries.site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

// Fetch all visible events with our global data
export async function getEvents(preview) {
  const query = `
    {
      "events": *[_type == "event" && visibility == "visible"] | order(_updatedAt desc)[]{
        ${queries.event}
      },
      ${queries.site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

// Fetch all visible events by category with our global data
export async function getEventsByCategory(slug, preview) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "category": *[_type == "eventCategory" && slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        ${queries.eventCategory}
      },
      "events": *[_type == "event" && visibility == "visible" && category->slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[]{
        ${queries.event}
      },
      ${queries.site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}
