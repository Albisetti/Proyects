import { Book } from 'phosphor-react'

export default {
  title: 'Book Module',
  name: 'book',
  icon: Book,
  type: 'object',
  options: { collapsible: true },
  fields: [
    {
      type: 'reference',
      name: 'template',
      title: 'Book Template',
      to: [{ type: 'bookTemplate'}]
    },
    {
      type: 'array',
      name: 'pages',
      title: 'Book Page Groups (L-R)',
      of: [{ type: 'bookPage' }],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Book'
      }
    }
  }
}