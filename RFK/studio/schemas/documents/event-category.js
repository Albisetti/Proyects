import { Folders } from 'phosphor-react'

export default {
  title: 'Event Category',
  name: 'eventCategory',
  type: 'document',
  icon: Folders,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      description: '(required)',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current'
    },
    prepare({ title = 'Untitled', slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : ''
      }
    }
  }
}
