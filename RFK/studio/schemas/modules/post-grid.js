import { SquaresFour } from 'phosphor-react'

const layoutList = [
  { title: 'News (Two Rows/Columns)', value: 'news' },
  { title: 'Newsletter (Three Columns)', value: 'newsletter' },
  {
    title: 'Community Alliance (Four Columns)',
    value: 'community-alliance'
  }
]

const getLayoutTitle = value => {
  const layout = layoutList.find(layout => layout.value === value)
  return layout ? `${layout?.title} Layout` : ''
}

export default {
  title: 'Post Grid',
  name: 'postGrid',
  type: 'object',
  icon: SquaresFour,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Layout',
      name: 'layout',
      type: 'string',
      options: {
        list: layoutList
      },
      validation: Rule => Rule.required()
    },
    {
      title: 'Post Category',
      name: 'categoryFilter',
      type: 'reference',
      to: [{ type: 'postCategory' }]
    }
  ],
  preview: {
    select: {
      layout: 'layout',
      category: 'categoryFilter.title'
    },
    prepare({ layout, category }) {
      return {
        title: `Post Grid${category ? ` (${category})` : ''}`,
        subtitle: getLayoutTitle(layout)
      }
    }
  }
}
