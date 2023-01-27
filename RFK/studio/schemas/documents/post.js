import { Note } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Post',
  name: 'post',
  type: 'document',
  icon: Note,
  fieldsets: [
    {
      title: 'Post Details',
      name: 'postDetails',
      options: {
        columns: 2
      }
    },
    {
      title: 'Featured Image',
      name: 'featuredImage',
      options: {
        collapsible: true
      }
    },
    {
      title: 'Alternate Image',
      name: 'alternateImage',
      options: {
        collapsible: true
      }
    }
  ],
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
        maxLength: 98
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
      initialValue: 'visible',
      fieldset: 'postDetails',
      validation: Rule => Rule.required()
    },
    {
      title: 'Published Date',
      name: 'publishedAt',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      fieldset: 'postDetails',
      validation: Rule => Rule.required()
    },
    {
      title: 'Category',
      name: 'category',
      type: 'reference',
      to: [{ type: 'postCategory' }],
      fieldset: 'postDetails'
    },
    {
      title: 'Author',
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      fieldset: 'postDetails'
    },
    customImage({
      title: 'Featured Image',
      name: 'featuredImage',
      fieldset: 'featuredImage'
    }),
    customImage({
      title: 'Alternate Image',
      name: 'alternateImage',
      fieldset: 'alternateImage'
    }),
    {
      title: 'Content',
      name: 'content',
      type: 'complexPortableText'
    },
    {
      title: 'Excerpt',
      name: 'excerpt',
      type: 'text',
      rows: 4,
      description: 'A short description of the post.',
      validation: Rule => Rule.max(240)
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
      slug: 'slug.current',
      category: 'category.title',
      media: 'featuredImage'
    },
    prepare({ title = 'Untitled', slug, category, media }) {
      return {
        title,
        subtitle: category ? category : `/${slug}`,
        media
      }
    }
  }
}
