import { Table } from 'phosphor-react'

export default {
  title: 'Free Tab',
  name: 'freeTab',
  type: 'object',
  icon: Table,
  fields: [
    {
      title: 'Tab Title',
      name: 'tabTitle',
      type: 'string'
    },
    {
      title: 'Text blocks',
      name: 'textBlocks',
      type: 'array',
      of: [
        {
          type: 'grid'
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
