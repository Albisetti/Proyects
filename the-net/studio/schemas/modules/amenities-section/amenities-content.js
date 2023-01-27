import { Article } from 'phosphor-react'

export default {
  title: 'AMENITIES - Amenities Content',
  name: 'amenitiesContent',
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
      title: 'Link List',
      name: 'linksList',
      type: 'linksList'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Amenities Content'
      }
    }
  }
}
