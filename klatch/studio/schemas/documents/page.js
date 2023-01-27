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
        { type: 'grid' },
        { type: 'hero' },
        { type: 'promotional' },
        { type: 'twoColCTA' },
        { type: 'awards' },
        { type: 'marquee' },
        { type: 'stayInTouch' },
        { type: 'dividerPhoto' },
        { type: 'tagsSlider' },
        { type: 'productsSlider' },
        { type: 'book' },
        { type: 'locationGrid' },
        { type: 'subscriptionsPageContent' },
        { type: 'awardsHero' },
        { type: 'twoColWithImagesAndText' },
        { type: 'findYourBeansHero' },
        { type: 'brewGuideGrid' },
        { type: 'clipboard' },
        { type: 'twoColTextAndClipboard' },
        { type: 'ourStoryFamilyBios' },
        { type: 'ourStoryNotesSection' },
        { type: 'tastingTrainingList' },
        { type: 'videoProjector' },
        { type: 'ourStoryHero' },
        { type: 'ourStoryMoreInfo' },
        { type: 'ourStoryImageCTA' },
        { type: 'wholesaleHeading' },
        { type: 'wholesaleBackgroundWithCards' },
        { type: 'campusInformation' },
        { type: 'instructorList' },
        { type: 'wholesaleFirstSection' },
        { type: 'wholesaleTwoColWithCtaAndClipboard' },
        { type: 'accordionSetsWithHeading' },
        { type: 'threeColCtaWithImages' },
        { type: 'twoColCtaWithRichText' },
        { type: 'careersPageContent' },
        { type: 'menuPageContent' },
        { type: 'shopCrowdPleasers' },
        { type: 'shopCollectionDisplay' }
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
