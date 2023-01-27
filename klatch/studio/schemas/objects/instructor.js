import { ChalkboardTeacher } from 'phosphor-react'

export default {
  title: 'Instructor',
  name: 'instructor',
  type: 'object',
  icon: ChalkboardTeacher,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.required()
    },
    {
      title: 'Link',
      name: 'link',
      type: 'navLink'
    },
    {
      title: 'Color',
      name: 'color',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Orange', value: 'orange' },
          { title: 'Red', value: 'red' }
        ],
        layout: 'radio',
        direction: 'horizontal'
      },
      validation: Rule => Rule.required()
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      name: 'name'
    },
    prepare({ name = 'Untitled' }) {
      return {
        title: name
      }
    }
  }
}
