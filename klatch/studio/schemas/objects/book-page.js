import { NoteBlank } from 'phosphor-react'

export default {
  title: 'Book Page',
  icon: NoteBlank,
  name: 'bookPage',
  type: 'object',
  fields: [
    {
      name: 'sheets',
      type: 'object',
      fields: [
        {
          type:'bookSheet',
          name: 'leftPage',
          title: 'Left Sheet Content',
          description: 'Add the left content blocks',
          options: { collapsible: true },
        },
        {
          type:'bookSheet',
          name: 'rightPage',
          title: 'Right Sheet Content',
          description: 'Add the right content blocks',
          options: { collapsible: true },
        }
      ]
    }
  ],
    options: {
      preview: {
        prepare(){
          return {
            title: 'Book Page'
          }
        }
      }
    }
  }