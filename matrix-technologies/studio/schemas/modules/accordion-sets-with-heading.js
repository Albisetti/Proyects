import { ListPlus } from 'phosphor-react'

export default {
  title: 'Accordion Sets with Heading',
  name: 'accordionSetsWithHeading',
  type: 'object',
  icon: ListPlus,
  fields: [
    {
      title: 'Heading',
      name: 'heading',
      type: 'text',
      rows: 2,
    },
    {
      title: 'Accordion Set',
      name: 'accordionSet',
      type: 'array',
      of: [{ type: 'accordionSet' }],
    },
    {
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'Use for linking to this section.',
    },
  ],
  preview: {
    select: {
      accordionSet: 'accordionSet',
    },
    prepare({ accordionSet }) {
      return {
        title: 'Accordion Sets with Heading',
        subtitle: `${accordionSet.length} item(s)`,
      }
    },
  },
}
