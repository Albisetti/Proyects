import { Star } from 'phosphor-react'

export default {
  title: 'Find Your Beans Hero',
  name: 'findYourBeansHero',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'text'
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'string'
    },
  ],
  preview: {
    select: {
      heroTitle: 'title'
    },
    prepare({ heroTitle }) {
      return {
        title: 'Find your beans Hero',
        subtitle: heroTitle
      }
    }
  }
}
