import { Rows } from 'phosphor-react'

export default {
  title: 'Key Value Pair',
  name: 'keyValue',
  type: 'object',
  icon: Rows,
  fields: [
    {
      title: 'Key',
      name: 'key',
      type: 'string'
    },
    {
      title: 'Value',
      name: 'value',
      type: 'string'
    }
  ],
  preview: {
    select: {
      title: 'key',
      subtitle: 'value'
    },
    prepare({ title = 'Key', subtitle = 'Value' }) {
      return {
        title,
        subtitle
      }
    }
  }
}
