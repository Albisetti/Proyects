import { CaretCircleDoubleDown } from 'phosphor-react'

export default {
  title: 'Accordion Set',
  name: 'accordions',
  type: 'object',
  icon: CaretCircleDoubleDown,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Accordions',
      name: 'accordions',
      type: 'array',
      of: [{ type: 'accordion' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      accordions: 'accordions'
    },
    prepare({ title = 'Untitled', accordions }) {
      return {
        title,
        subtitle: `${accordions.length} item(s)`
      }
    }
  }
}
