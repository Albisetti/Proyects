import { Person } from 'phosphor-react'
import customImage from '../../../../studio/lib/custom-image'

export default {
  title: 'Executive Tab',
  name: 'executiveTab',
  type: 'object',
  icon: Person,
  fields: [
    {
      title: 'Tab Title',
      name: 'tabTitle',
      type: 'string'
    },
    {
      title: 'Staff List',
      name: 'staffList',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Name', name: 'name', type: 'string' },
            { title: 'Job Title', name: 'jobTitle', type: 'string' },
            customImage({
              title: 'Photo',
              name: 'photo'
            }),
            { title: 'Description', name: 'description', type: 'simplePortableText' }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      text: 'tabTitle'
    },
    prepare({ text }) {
      return {
        title: 'Accordion List',
        subtitle: text
      }
    }
  }
}
