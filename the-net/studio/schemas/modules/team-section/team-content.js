import { Article } from 'phosphor-react'

export default {
  title: 'TEAM - Team Content',
  name: 'teamContent',
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
      type: 'text'
    },
    {
      title: 'Team Members',
      name: 'teamMembers',
      type: 'teamMembers'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Team Content'
      }
    }
  }
}
