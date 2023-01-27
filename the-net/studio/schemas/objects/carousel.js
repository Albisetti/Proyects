import { Circle, Stack } from 'phosphor-react'

export default {
  title: 'LANDING - Carousel',
  name: 'carousel',
  type: 'object',
  icon: Stack,
  fields: [
    {
      title: 'Items',
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'object',
          icon: Circle,
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            },
            {
              name: 'item',
              type: 'array',

              of: [{ type: 'string' }]
            }
          ],
          preview: {
            select: {
              itemCount: 'item.length',
              title: 'title'
            },
            prepare({ itemCount, title }) {
              return {
                title: `${title} (${itemCount} item${
                  itemCount === 1 ? '' : 's'
                })`
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      itemCount: 'items.length'
    },
    prepare({ itemCount }) {
      return {
        title: `:Carousel: ${itemCount} slide${itemCount === 1 ? '' : 's'}`
      }
    }
  }
}
