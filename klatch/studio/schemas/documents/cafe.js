import { orderingMenuItemsForType } from '@sanity/base/structure-builder'
import { Coffee } from 'phosphor-react'

export default {
  title: 'Cafe',
  name: 'cafe',
  type: 'document',
  icon: Coffee,
  fieldsets: [
    {
      name: 'orderOnlineLink',
      title: 'Order Online Link'
    }
  ],
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Address',
      name: 'address',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required()
    },
    {
      title: 'Hours of Operation',
      name: 'hours',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required()
    },
    {
      title: 'Storefront Image',
      name: 'image',
      type: 'image',
      validation: Rule => Rule.required()
    },
    {
      title: 'Title',
      description: 'Link text to display.',
      name: 'orderOnlineTitle',
      type: 'string',
      validation: Rule => Rule.required(),
      initialValue: 'Order Online',
      fieldset: 'orderOnlineLink'
    },
    {
      title: 'Slug',
      description: 'Enter a slug.',
      name: 'orderOnlineSlug',
      type: 'slug',
      options: { isUnique: () => true },
      validation: Rule => Rule.required(),
      initialValue: { _type: 'slug', current: 'shop' },
      fieldset: 'orderOnlineLink'
    },
    {
      title: 'Events',
      name: 'events',
      type: 'array',
      of: [{ type: 'event' }]
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    },
    prepare({ title = 'Untitled', media }) {
      return {
        title,
        media
      }
    }
  }
}
