import { Infinity } from 'phosphor-react'

export default {
  title: 'Annnouncement',
  name: 'announcementObject',
  type: 'object',
  icon: Infinity,
  fields: [
    {
        title: 'Title',
        name: 'title',
        type: 'string',
      },
      {
        title: 'SubTitle',
        name: 'subtitle',
        type: 'string',
      },
      {
        title: 'CTA',
        name: 'cta',
        type: 'cta',
      },
      {
          title: 'Image',
          name: 'image',
          type: 'image',
      },
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: title,
      }
    }
  }
}
