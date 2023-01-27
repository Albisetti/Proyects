import { ListDashes, HandPointing } from 'phosphor-react'

import customImage from '../../../studio/lib/custom-image'

export default {
  title: 'CTA List',
  name: 'ctaList',
  type: 'object',
  icon: ListDashes,
  fields: [
    {
      title: 'Title',
      name: 'title',
      description: 'Text to display as a title for the section.',
      type: 'string'
    },
    {
      title: 'Items',
      name: 'items',
      type: 'array',
      of: [
        {
          title: 'CTA Item',
          name: 'ctaItem',
          type: 'object',
          icon: HandPointing,
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            },
            customImage({ title: 'Preview Image', name: 'image' }),
            {
              title: 'Description',
              name: 'description',
              type: 'text'
            },
            {
              title: 'CTA Link',
              name: 'link',
              type: 'link'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      itemCount: 'items.length'
    },
    prepare({ title = 'Untitled', itemCount = 0 }) {
      return {
        title: 'CTA List',
        subtitle: `${title}: ${itemCount} item${itemCount === 1 ? '' : 's'}`
      }
    }
  }
}
