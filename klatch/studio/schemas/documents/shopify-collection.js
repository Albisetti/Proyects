import React from 'react'
import { SquaresFour } from 'phosphor-react'

export default {
  title: 'Collection',
  name: 'collection',
  type: 'document',
  icon: () => <SquaresFour />,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Description (optional)',
      type: 'string'
    },
    {
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      description: '(required)',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      title: 'Overlay header with transparency?',
      name: 'hasTransparentHeader',
      type: 'boolean',
      description:
        'When activated the header will overlay the first content module with a transparent background and white text until scrolling is engaged.',
      initialValue: false
    },
    {
      title: 'Page Modules',
      name: 'modules',
      type: 'array',
      of: [
        { type: 'collectionGrid' },
        { type: 'grid' },
        { type: 'hero' },
        { type: 'marquee' },
        { type: 'dividerPhoto' },
        { type: 'shopCrowdPleasers' },
        {type:'productsList'},
        { type: 'shopCollectionDisplay' }
      ]
    },
    {
      title: 'Products Grid',
      name: 'products',
      type: 'array',
      of: [
        {
          title: 'Product',
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            filter: ({ document }) => {
              const addedProducts = document.products
                .map(p => p._ref)
                .filter(Boolean)

              return {
                filter: '!(_id in $ids)',
                params: {
                  ids: addedProducts
                }
              }
            }
          }
        }
      ],
      validation: Rule => Rule.unique()
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
      const path = `/shop/${slug.current}`
      return {
        title,
        subtitle: slug.current ? path : '(missing slug)'
      }
    }
  }
}
