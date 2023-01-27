import { NotePencil } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Our Story Notes Section',
  name: 'ourStoryNotesSection',
  type: 'object',
  icon: NotePencil,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Text Content',
      name: 'content',
      type: 'text'
    },
    {
      title: 'Left Note Title',
      name: 'leftNoteTitle',
      type: 'string'
    },
    {
      title: 'Left Notes',
      name: 'leftNotes',
      type: 'array',
      of: [{ type: 'string' }]
    },
    customImage({
      title: 'First Polaroid Image',
      name: 'firstPolaroidImg'
    }),
    customImage({
      title: 'Second Polaroid Image',
      name: 'secondPolaroidImg'
    })
  ],
  preview: {
    select: {
      sectionTitle: 'title'
    },
    prepare({ sectionTitle }) {
      return {
        title: 'Our Story Notes Section',
        subtitle: sectionTitle
      }
    }
  }
}
