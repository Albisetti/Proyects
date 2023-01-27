import React from 'react'
import { Browser } from 'phosphor-react'

export default {
  title: 'Page',
  name: 'page',
  type: 'document',
  icon: () => <Browser />,
  fields: [
    {
      name: 'title',
      title: 'Title',
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
        { type: 'linksList' },
        { type: 'galleryModal' },
        { type: 'gallery' },
        { type: 'buildingContainer' },
        { type: 'buildingContent' },
        { type: 'brandVideo' },
        { type: 'amenitiesContainer' },
        { type: 'amenitiesContent' },
        { type: 'landingContainer' },
        { type: 'teamContainer' },
        { type: 'buildingInfo' },
        { type: 'floorContainer' },
        { type: 'floorContent' },
        { type: 'floorDetails' },
        { type: 'locationContainer' },
        { type: 'grid' },
        { type: 'hero' },
        { type: 'marquee' },
        { type: 'dividerPhoto' },
        { type: 'title' },
        { type: 'verticalNav' }
      ]
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
