import { Circle, Columns, Square } from 'phosphor-react'

export default {
  title: 'Columns With Links',
  name: 'columnsWithLinks',
  type: 'object',
  icon: Columns,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Columns',
      name: 'columns',
      type: 'array',
      of: [
        {
          title: 'Column',
          name: 'column',
          type: 'object',
          icon: Square,
          fields: [
            {
              title: 'Link Items',
              name: 'linkItems',
              type: 'array',
              of: [
                {
                  title: 'Link Item',
                  name: 'linkItem',
                  type: 'object',
                  icon: Circle,
                  fields: [
                    {
                      title: 'Title',
                      name: 'title',
                      type: 'string'
                    },
                    {
                      title: 'Links Menu',
                      name: 'menu',
                      type: 'reference',
                      to: [{ type: 'menu' }]
                    }
                  ]
                }
              ]
            }
          ],
          preview: {
            select: {
              itemCount: 'linkItems.length'
            },
            prepare({ itemCount }) {
              return {
                title: 'Column',
                subtitle: `${itemCount || 0} item${itemCount === 1 ? '' : 's'}`
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      cols: 'columns.length'
    },
    prepare({ cols }) {
      return {
        title: 'Columns With Links',
        subtitle: `${cols || 0} column${cols === 1 ? '' : 's'}`
      }
    }
  }
}
