import { CaretCircleDown } from 'phosphor-react'

export default {
  title: 'Accordion',
  name: 'accordion',
  type: 'object',
  icon: CaretCircleDown,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Content',
      name: 'content',
      type: 'simplePortableText',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title = 'Untitled' }) {
      return {
        title
      }
    }
  }
}
