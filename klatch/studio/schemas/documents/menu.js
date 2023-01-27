import React from 'react'
import { List } from 'phosphor-react'

export default {
  title: 'Menu',
  name: 'menu',
  type: 'document',
  icon: () => <List />,
  fields: [
    {
      title: 'Menu Name',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Navigation Items',
      name: 'items',
      type: 'array',
      of: [
        { type: 'navPage' },
        { type: 'navLink' },
        { type: 'navDropdown' },
        { type: 'navLinkWithDropdown' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items'
    },
    prepare({ title = 'Untitled', items = [] }) {
      return {
        title,
        subtitle: `${items.length} link(s)`,
        media: List
      }
    }
  }
}
