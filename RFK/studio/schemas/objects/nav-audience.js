import { User } from 'phosphor-react'

export default {
  title: 'Audience',
  name: 'navAudience',
  type: 'object',
  icon: User,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Display Text'
    },
    {
      title: 'Audience',
      name: 'audience',
      type: 'reference',
      to: [{ type: 'audience' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title,

      }
    }
  }
}
