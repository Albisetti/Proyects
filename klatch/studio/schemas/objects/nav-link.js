import { ArrowSquareOut } from 'phosphor-react'

export default {
  title: 'Link',
  name: 'navLink',
  type: 'object',
  icon: ArrowSquareOut,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Display Text'
    },
    {
      title: 'URL',
      name: 'url',
      type: 'slug',
      description: 'Enter URL'
    },
    {
      title: 'Target',
      name: 'target',
      type: 'string',
      options: {
        list: [
          { value: '_self', title: 'Same Window' },
          { value: '_target', title: 'New Window' }
        ]
      }
    }
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url'
    },
    prepare({ title, url }) {
      return {
        title: title,
        subtitle: url.current
      }
    }
  }
}
