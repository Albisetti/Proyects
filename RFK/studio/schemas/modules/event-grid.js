import { CalendarPlus } from 'phosphor-react'

const layoutList = [{ title: 'Three Column', value: 'three-column' }]

const getLayoutTitle = value => {
  const layout = layoutList.find(layout => layout.value === value)
  return layout ? `${layout?.title} Layout` : ''
}

export default {
  title: 'Event Grid',
  name: 'eventGrid',
  type: 'object',
  icon: CalendarPlus,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      initialValue: 'Events'
    },
    {
      title: 'Layout',
      name: 'layout',
      type: 'string',
      options: {
        list: layoutList
      },
      initialValue: 'three-column'
    }
  ],
  preview: {
    select: {
      layout: 'layout'
    },
    prepare({ layout }) {
      return {
        title: 'Event Grid',
        subtitle: getLayoutTitle(layout)
      }
    }
  }
}
