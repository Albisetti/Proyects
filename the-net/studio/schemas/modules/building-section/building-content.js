import { Article } from 'phosphor-react'

export default {
  title: 'BUILDING - Building Content',
  name: 'buildingContent',
  type: 'object',
  icon: Article,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'string'
    },
    {
      title: 'Links List',
      name: 'linksList',
      type: 'linksList'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Building Content'
      }
    }
  }
}
