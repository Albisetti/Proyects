import { Note } from 'phosphor-react'

export default {
  title: 'Post',
  name: 'post',
  type: 'document',
  icon: Note,
  fieldsets: [
    {
      name: 'postDetails',
      options: {
        columns: 2,
      },
    },
    {
      title: 'Featured Image',
      name: 'featuredImage',
      options: {
        collapsible: true,
      },
    },
  ],
  fields: [
    {
      title: 'Title',
      description: '(required)',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      description: '(required)',
      options: {
        source: 'title',
        maxLength: 98,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Visibility',
      name: 'visibility',
      type: 'string',
      options: {
        list: [
          { title: 'Visible', value: 'visible' },
          { title: 'Hidden', value: 'hidden' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'visible',
      fieldset: 'postDetails',
    },
    {
      title: 'Published Date',
      name: 'publishedAt',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      fieldset: 'postDetails',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Category',
      name: 'category',
      type: 'reference',
      to: [{ type: 'postCategory' }],
      fieldset: 'postDetails',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Author',
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      fieldset: 'postDetails',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Featured Image',
      name: 'featuredImage',
      type: 'image',
      fieldset: 'featuredImage',
    },
    {
      title: 'Content',
      name: 'content',
      type: 'complexPortableText',
    },
    {
      title: 'Excerpt',
      name: 'excerpt',
      type: 'text',
      rows: 4,
      description: 'A short description of the post.',
      validation: (Rule) => Rule.max(240),
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      category: 'category.title',
      media: 'featuredImage',
    },
    prepare({ title = 'Untitled', slug, category, media }) {
      return {
        title,
        subtitle: `/${slug} (${category})`,
        media,
      }
    },
  },
}
