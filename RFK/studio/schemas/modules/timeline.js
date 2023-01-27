import { Clock } from 'phosphor-react'

export default {
  title: 'Timeline',
  name: 'timeline',
  type: 'object',
  icon: Clock,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
        title: 'Description',
        name: 'description',
        type: 'text',
    },
    {
        title: 'Time Events',
        name: 'timeEvents',
        type: 'array',
        of: [
            {type: 'timeEvent'}
        ]
    }
  ],
  preview: {
    select: {
      itemCount: 'timeEvents.length'
    },
    prepare({itemCount}){
      return {
        title: 'Timeline',
        subtitle: `${itemCount} time event${itemCount === 1 ? '' : 's'}`
      }
    }
  }
}
