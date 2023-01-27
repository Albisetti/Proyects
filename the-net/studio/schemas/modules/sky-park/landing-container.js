import { Buildings } from 'phosphor-react'

export default {
  title: 'SKY PARK - Landing Container',
  name: 'landingContainer',
  type: 'object',
  icon: Buildings,
  fields: [
    {
      title: 'Landing Content',
      name: 'landingContent',
      type: 'landingContent'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Landing Container'
      }
    }
  }
}
