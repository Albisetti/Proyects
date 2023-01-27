import { Star } from 'phosphor-react'

export default {
  title: 'Shop Crowd Pleasers Section',
  name: 'shopCrowdPleasers',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'string'
    },
    {
      title: 'Products On Display',
      name: 'products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }]
    }
  ],
  preview: {
    select: {
      sectionTitle: 'title'
    },
    prepare({ sectionTitle }) {
      return {
        title: 'Crowd Pleasers Section',
        subtitle: sectionTitle
      }
    }
  }
}
