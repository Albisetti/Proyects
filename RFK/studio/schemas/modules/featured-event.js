import { Calendar } from 'phosphor-react'

export default {
  title: 'Featured Event',
  name: 'featuredEvent',
  type: 'object',
  icon: Calendar,
  fields: [
    {
      title: 'Event',
      name: 'event',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      eventTitle: 'event.title'
    },
    prepare({ eventTitle }) {
      return {
        title: 'Featured Event',
        subtitle: eventTitle
      }
    }
  }
}
