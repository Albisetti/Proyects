import { Buildings } from 'phosphor-react'

export default {
  title: 'TEAM - Team Container',
  name: 'teamContainer',
  type: 'object',
  icon: Buildings,
  fields: [
    {
      title: 'Team Content',
      name: 'teamContent',
      type: 'teamContent'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Team Container'
      }
    }
  }
}
