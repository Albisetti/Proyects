import { SquareHalfBottom } from 'phosphor-react'

export default {
  title: 'Multi Column Text',
  name: 'multiColumnText',
  type: 'object',
  icon: SquareHalfBottom,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Text to display as heading for the section'
    },
    {
      title: 'Top Border',
      name: 'includeTopBorder',
      type: 'boolean',
      description: 'Add border line above title'
    },
    {
      title: 'Text Columns',
      name: 'textColumns',
      type: 'array',
      of: [
        {
          title: 'Column',
          name: 'columns',
          type: 'object',
          fields: [
            {
              title: 'Column Content',
              name: 'content',
              type: 'simplePortableText'
            }
          ],
          preview: {
            select: {
              content: 'content'
            },
            prepare(value) {
              const block = (value.content || []).find(block => block._type === 'block')
              return {
                title: block
                  ? block.children
                    .filter(child => child._type === 'span')
                    .map(span => span.text)
                    .join('')
                  : 'No title'
              }
            }
          }
        },
      ],
      options: {
        collapsible: true
      },
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: 'Multi Columns Text',
        subtitle: title
      }
    }
  }
}
