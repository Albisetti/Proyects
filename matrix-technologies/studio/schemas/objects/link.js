import { Link } from 'phosphor-react'

export default {
  title: 'Link',
  name: 'link',
  type: 'object',
  icon: Link,
  options: {
    collapsible: true,
    collapsed: true,
  },
  fieldsets: [
    {
      title: 'Link Options',
      name: 'linkOptions',
      options: {
        columns: 2,
      },
    },
  ],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
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
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
      fieldset: 'linkOptions',
    },
    {
      title: 'Target',
      name: 'target',
      type: 'string',
      description: 'Click behavior for the link',
      options: {
        list: [
          { title: 'Same Window', value: '_self' },
          { title: 'New Window', value: '_blank' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '_self',
      fieldset: 'linkOptions',
    },
    {
      title: 'URL',
      name: 'hrefInternal',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'collection' }, { type: 'product' }],
      hidden: ({ parent }) => {
        return parent.linkType !== 'internal'
      },
    },
    {
      title: 'URL',
      name: 'hrefExternal',
      type: 'url',
      description: 'Full URL (e.g. https://)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
      hidden: ({ parent }) => {
        return parent.linkType !== 'external'
      },
    },
    {
      title: 'Parameters',
      name: 'parameters',
      type: 'string',
      description: 'Anchor, query parameters, etc.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      linkType: 'linkType',
      url: 'hrefExternal',
      slug: 'hrefInternal.slug.current',
    },
    prepare({ title, linkType, url, slug }) {
      return {
        title: title,
        subtitle: linkType === 'internal' ? `/${slug}` : url,
      }
    },
  },
}
