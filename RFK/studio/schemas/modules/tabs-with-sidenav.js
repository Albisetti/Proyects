import { Tabs } from 'phosphor-react'

export default {
  title: 'Tabs With Sidenav',
  name: 'tabsWithSidenav',
  type: 'object',
  icon: Tabs,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'All Tabs Visible',
      name: 'allVisible',
      description:
        "The tabs' content will be visible throughout the page stacked on each other. If this is disabled, the sidenav will 'switch' between one visible tab.",
      type: 'boolean',
      initialValue: false
    },
    {
      title: 'Tabs',
      name: 'tabs',
      type: 'array',
      of: [
        { type: 'executiveTab' },
        { type: 'directorTab' },
        { type: 'freeTab' }
      ]
    },
    {
      title: 'Darker Background',
      name: 'darkerBg',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Tabs With Sidenav'
      }
    }
  }
}
