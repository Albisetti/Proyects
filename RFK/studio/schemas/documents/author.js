import { User } from 'phosphor-react'

export default {
  title: 'Author',
  name: 'author',
  type: 'document',
  icon: User,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      name: 'name'
    },
    prepare({ name = 'Unnamed' }) {
      return {
        title: name
      }
    }
  }
}
