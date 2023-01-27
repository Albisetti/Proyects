import { Star } from 'phosphor-react'

export default {
  title: 'Internal Hero',
  name: 'internalHero',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'string'
    },
    {
      title: 'Background Image',
      name: 'backgroundImage',
      type: 'image',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      text: 'title'
    },
    prepare({ text }) {
      return {
        title: 'Internal Hero',
        subtitle: text
      }
    }
  }
}
