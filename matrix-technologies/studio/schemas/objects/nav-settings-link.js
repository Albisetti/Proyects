import { LinkSimple } from 'phosphor-react'

export default {
  title: 'Settings Link',
  name: 'navSettingsLink',
  type: 'object',
  icon: LinkSimple,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Settings Link',
      name: 'settingsLink',
      type: 'reference',
      to: [{ type: 'settingsLink' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      url: 'settingsLink.url',
    },
    prepare({ title, url }) {
      return {
        title: title,
        subtitle: url,
      }
    },
  },
}
