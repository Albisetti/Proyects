import { Link } from 'phosphor-react'

export default {
  title: 'GLOBAL - Link List',
  name: 'linksList',
  type: 'object',
  icon: Link,
  fields: [
    {
      title: 'Links',
      name: 'links',
      type: 'array',
      of: [{ type: 'link' }]
    },
    {
      title: 'Links Alignment',
      name: 'linksAlignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'items-start' },
          { title: 'Center', value: 'items-center' },
          { title: 'Right', value: 'items-end' }
        ]
      },
      hidden: ({ parent }) => {
        return parent.amenitiesStyle
      }
    },
    {
      title: 'Amenities Style',
      name: 'amenitiesStyle',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    select: {
      linkCount: 'links.length'
    },
    prepare({ linkCount }) {
      return {
        title: 'Link List',
        subtitle: `${linkCount || 0} link${linkCount === 1 ? '' : 's'}`
      }
    }
  }
}
