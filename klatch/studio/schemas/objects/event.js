import { Calendar } from 'phosphor-react'

export default {
  title: 'Event',
  name: 'event',
  type: 'object',
  icon: Calendar,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Description',
      name: 'description',
      type: 'complexPortableText',
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
