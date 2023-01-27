import { Infinity } from 'phosphor-react'

export default {
  title: 'Annnouncement Carousel',
  name: 'announcementCarousel',
  type: 'object',
  icon: Infinity,
  fields: [
    {
      title: 'Items',
      name: 'items',
      type: 'array',
      of: [
        {type:'announcementObject'}
      ],
      validation: Rule => Rule.min(1).required()
    },
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ text }) {
      return {
        title: 'Announcement Bar',
      }
    }
  }
}
