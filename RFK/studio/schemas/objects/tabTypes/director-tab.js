import { User } from 'phosphor-react'

export default {
  title: 'Director Tab',
  name: 'directorTab',
  type: 'object',
  icon: User,
  fields: [
    {
      title: 'Tab Title',
      name: 'tabTitle',
      type: 'string'
    },
    {
      title: 'Tab Description',
      name: 'tabDescription',
      type: 'text'
    },
    {
      title: 'Columns',
      name: 'columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Staff List',
              name: 'staffList',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { title: 'Name', name: 'name', type: 'string' },
                    { title: 'Job Title', name: 'jobTitle', type: 'string' }
                  ]
                }
              ]

            }
          ],
          preview: {
            select: {
              itemCount: 'staffList.length'
            },
            prepare({ itemCount }) {
              return {
                title: 'Column',
                subtitle: `${itemCount} item${itemCount === 1 ? '' : 's'}`
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      text: 'tabTitle'
    },
    prepare({ text }) {
      return {
        title: 'Accordion List',
        subtitle: text
      }
    }
  }
}
