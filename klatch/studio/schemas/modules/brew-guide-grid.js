import { SquaresFour } from 'phosphor-react'

export default {
  title: 'Brew Guide Grid',
  name: 'brewGuideGrid',
  type: 'object',
  icon: SquaresFour,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Description (Desktop)',
      name: 'descriptionDesktop',
      type: 'string'
    },
    {
      title: 'Description (Mobile)',
      name: 'descriptionMobile',
      type: 'string'
    },
    {
      title: 'Brew Guides',
      name: 'brewGuides',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'brewGuide' }]
        }
      ]
    },
    {
      title: 'Decorative Text for First Item',
      name: 'decorativeTextFirst',
      type: 'string',
      initialValue: "Holly's Favorite!"
    },
    {
      title: 'Decorative Text for Last Item',
      name: 'decorativeTextLast',
      type: 'string',
      initialValue: 'A Must Try!'
    },
    {
      title: 'Bottom Left Image (Desktop)',
      name: 'bottomLeftImage',
      type: 'image'
    },
    {
      title: 'Bottom Right Image (Desktop)',
      name: 'bottomRightImage',
      type: 'image'
    },
    {
      title: 'Bottom Right Image (Mobile)',
      name: 'bottomRightImageMobile',
      type: 'image'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Brew Guide Grid',
        subtitle: 'Displays a grid of brew guides.'
      }
    }
  }
}
