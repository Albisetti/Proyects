import { LinkSimple } from 'phosphor-react'

export default {
  title: 'Settings Link',
  name: 'settingsLink',
  type: 'document',
  icon: LinkSimple,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'URL',
      name: 'url',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'url',
      subtitle: 'title',
    },
    prepare({ title = 'Undefined', subtitle }) {
      return {
        title,
        subtitle,
      }
    },
  },
}
