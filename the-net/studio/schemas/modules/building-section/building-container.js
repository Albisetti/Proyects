import { Buildings } from 'phosphor-react'

export default {
  title: 'BUILDING - Building Container',
  name: 'buildingContainer',
  type: 'object',
  icon: Buildings,
  fields: [
    {
      title: 'Building Content',
      name: 'buildingContent',
      type: 'buildingContent'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Building Container'
      }
    }
  }
}
