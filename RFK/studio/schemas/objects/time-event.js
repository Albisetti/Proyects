import { CalendarCheck } from 'phosphor-react'

export default {
  title: 'Time Event',
  name: 'timeEvent',
  type: 'object',
  icon: CalendarCheck,
  fields: [
    {
      title: 'Date',
      name: 'date',
      type: 'string'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
    }
  ],
  preview: {
    select: {
      text: 'date'
    },
    prepare({ text }) {
      return {
        title: 'Time Event',
        subtitle: text
      }
    }
  }
}
