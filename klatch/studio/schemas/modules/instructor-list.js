import { UserList } from 'phosphor-react'

export default {
  title: 'Instructor List',
  name: 'instructorList',
  type: 'object',
  icon: UserList,
  fields: [
    {
      title: 'heading',
      name: 'heading',
      type: 'string',
      initialValue: 'Klatch Instructors'
    },
    {
      title: 'Paragraph',
      name: 'paragraph',
      type: 'text',
      rows: 2
    },
    {
      title: 'Instructors',
      name: 'instructors',
      type: 'array',
      of: [{ type: 'instructor' }],
      validation: Rule => Rule.max(4)
    }
  ],
  preview: {
    select: {
      instructors: 'instructors.length'
    },
    prepare({ instructors }) {
      return {
        title: 'Instructor List',
        subtitle: `Displaying ${instructors || 'no'} instructor${
          instructors === 1 ? '' : 's'
        }.`
      }
    }
  }
}
