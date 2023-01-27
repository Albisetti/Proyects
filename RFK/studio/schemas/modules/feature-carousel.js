import { ProjectorScreen } from 'phosphor-react'

export default {
  title: 'Feature Carousel',
  name: 'featureCarousel',
  type: 'object',
  icon: ProjectorScreen,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      initialValue: 'Featured Story'
    },
    {
      title: 'Items',
      name: 'items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }, { type: 'event' }] }],
      validation: Rule => Rule.min(1).required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      itemCount: 'items.length'
    },
    prepare({ title, itemCount }) {
      return {
        title: 'Feature Carousel',
        subtitle: `${title ? `${title} ` : ' '}(${
          itemCount ? itemCount : 0
        } item${itemCount === 1 ? '' : 's'})`
      }
    }
  }
}
