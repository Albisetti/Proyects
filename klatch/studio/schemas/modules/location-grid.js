import { SquaresFour } from 'phosphor-react'

export default {
  title: 'Location Grid',
  name: 'locationGrid',
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
      title: 'Order Online Link (Mobile)',
      name: 'orderOnlineLink',
      type: 'navPage'
    },
    {
      title: 'Locations',
      name: 'locations',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'cafe' }]
        }
      ]
    },
    {
      title: 'Top Right Image (Desktop)',
      name: 'topRightImage',
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
        title: 'Location Grid',
        subtitle: 'Displays a grid of Klatch cafe locations.'
      }
    }
  }
}
