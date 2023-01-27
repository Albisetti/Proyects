import { Link } from 'phosphor-react'

export default {
  title: 'Link',
  name: 'link',
  type: 'object',
  icon: Link,
  options: { collapsible: true },
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
          { title: 'External', value: 'external' },
          { title: 'Menu', value: 'menu' }
        ],
        layout: 'radio',
        direction: 'horizontal'
      }
    },
    {
      title: 'URL',
      name: 'hrefInternal',
      type: 'string',
      description: 'Path (e.g. products/blue-thunder-blend)',
      hidden: ({ parent }) => {
        return parent.linkType !== 'internal'
      }
    },
    {
      title: 'URL',
      name: 'hrefExternal',
      type: 'url',
      description: 'Full URL (e.g. https://)',
      hidden: ({ parent }) => {
        return parent.linkType !== 'external'
      }
    },
    {
      title: 'Menu Slug',
      name: 'menuSlug',
      type: 'string',
      description: 'Slug of the component that will be used as menu',
      hidden: ({ parent }) => {
        return parent.linkType !== 'menu'
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
      },
      hidden: ({ parent }) => {
        return parent.linkType == 'menu'
      }
    },
    {
      title: 'Arrow Link',
      name: 'arrowLink',
      type: 'boolean',
      initialValue: false
    }
  ]
}
