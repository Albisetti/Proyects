import { Link } from 'phosphor-react'

export default {
  title: 'Link',
  name: 'link',
  type: 'object',
  options: { collapsible: true },
  icon: Link,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Type',
      name: 'linkType',
      type: 'string',
      description: 'Is the link to an internal page or an external website?',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'External', value: 'external' }
        ],
        layout: 'radio',
        direction: 'horizontal'
      }
    },
    {
      title: 'URL',
      name: 'hrefInternal',
      type: 'string',
      description: 'Add path (e.g. products/blue-thunder-blend)',
      hidden: ({ parent }) => {
        return parent.linkType !== 'internal'
      }
    },
    {
      title: 'URL',
      name: 'hrefExternal',
      type: 'url',
      description: 'Full URL (e.g. https)',
      hidden: ({ parent }) => {
        return parent.linkType !== 'external'
      }
    },
    {
      title: 'Target',
      name: 'target',
      type: 'string',
      description: 'Click behavior for the link',
      options: {
        list: [
          { title: 'New Window', value: '_blank' },
          { title: 'Same Window', value: '_self' }
        ],
        layout: 'radio',
        direction: 'horizontal'
      }
    }
  ]
}
