import React from 'react'
import { List } from 'phosphor-react'

export default {
  title: 'CTA',
  name: 'cta',
  type: 'document',
  options: { collapsible: true },
  icon: () => <List />,
  fields: [
    {
      title: 'CTA Type',
      name: 'ctaType',
      type: 'string',
      description: 'Internal or External URL',
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
        title: 'CTA Link',
        name: 'hrefExternal',
        type: 'url',
        description:'Full URL (https)',
        hidden: ({ parent }) => {
          return parent.ctaType !== "external"
        }
      },
      {
        title: 'CTA Link',
        name: 'hrefInternal',
        type: 'string',
        description:'Add path name e.g products/blue-thunder-blend',
        hidden: ({ parent }) => {
          return parent.ctaType !== "internal"
        }
      },
      {
        title: 'CTA Title',
        name: 'title',
        type: 'string',
        description: 'Title/description of the cta'
      },
      {
        title: 'CTA Target',
        name: 'target',
        type: 'string',
        description: 'Click Behavior of the CTA',
        options: {
          list: [
            { title: 'New Window', value: '_blank' },
            { title: 'Same Window', value: '_self' }
          ],
          layout: 'radio',
          direction: 'horizontal'
        }
      },
      {
        title: 'Button Color',
        type: 'string',
        name: 'color',
        options: {
          list: [
            {title: 'Orange', value: 'orange'},
            {title: 'Green', value: 'green'},
            {title: 'Pink', value: 'pink'},
            {title: 'Blue', value: 'blue'},
          ]
        }
      },
    
  ],
  preview: {
    select: {
      title: 'title',
      items: 'href'
    },
    prepare({ title = 'Untitled', href  }) {
      return {
        title,
        href
      }
    }
  }
}
