import { Note } from 'phosphor-react'
import customImage from '../../lib/custom-image'

export default {
  title: 'Blog Post',
  name: 'blogPost',
  type: 'document',
  icon: Note,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: '(required)',
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
      title: 'Visibility',
      name: 'visibility',
      type: 'string',
      options: {
        list: [
          { title: 'Visible', value: 'visible' },
          { title: 'Hidden', value: 'hidden' }
        ],
        layout: 'radio',
        direction: 'horizontal'
      },
      initialValue: 'visible'
    },
    {
      title: 'Content',
      name: 'content',
      type: 'complexPortableText',
      validation: Rule => Rule.required()
    },
    {
      title: 'Categories',
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }]
    },
    customImage({ title: 'Featured Image', name: 'featuredImage' }),
    {
      title: 'Excerpt',
      name: 'excerpt',
      type: 'simplePortableText'
    },
    {
      title: 'Author',
      name: 'author',
      type: 'reference',
      to: { type: 'author' },
      validation: Rule => Rule.required()
    },
    {
      title: 'Tags',
      name: 'tags',
      type: 'tags'
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
      slug: 'slug'
    },
    prepare({ title = 'Untitled', slug = {} }) {
      const path = `/${slug.current}`
      return {
        title,
        subtitle: slug.current ? path : '(missing slug)'
      }
    }
  }
}
