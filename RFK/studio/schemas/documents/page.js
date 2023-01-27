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
      title: 'Transparent Header',
      name: 'hasTransparentHeader',
      type: 'boolean',
      initialValue: false
    },
    {
      title: 'Light Header',
      name: 'hasLightHeader',
      description: 'Apply a brighter style to the header for this page',
      type: 'boolean',
      initialValue: false
    },
    {
      title: 'Page Modules',
      name: 'modules',
      type: 'array',
      of: [
        { type: 'grid' },
        { type: 'hero' },
        { type: 'marquee' },
        { type: 'dividerPhoto' },
        { type: 'title' },
        { type: 'tabsWithSidenav' },
        { type: 'internalHero' },
        { type: 'twoColWithImage' },
        { type: 'ctaSectionsWithSideNav' },
        { type: 'announcementCarousel' },
        { type: 'audienceGrid' },
        { type: 'connectedNodes' },
        { type: 'careersJobBlocks' },
        { type: 'columnsWithLinks' },
        { type: 'featureCarousel' },
        { type: 'featuredEvent' },
        { type: 'eventGrid' },
        { type: 'postGrid' },
        { type: 'careersBenefitsSection' },
        { type: 'ctaCircle' },
        { type: 'howToReachUs' },
        { type: 'testimonialBlocks' },
        { type: 'timeline' },
        { type: 'fullBackgroundImageCTA' },
        { type: 'multiColumnText' },
        { type: 'waveLines' },
        { type: 'testHero' }
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
