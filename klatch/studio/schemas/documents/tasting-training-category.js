import { Tag } from 'phosphor-react'

export default {
  title: 'Tasting & Training Category',
  name: 'tastingTrainingCategory',
  type: 'document',
  icon: Tag,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title
      }
    }
  }
}
