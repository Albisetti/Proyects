import { User } from 'phosphor-react'

export default {
  title: 'Stay In Touch',
  name: 'stayInTouch',
  type: 'object',
  icon: User,
  fields: [
    {
        title: 'Left Title',
        name: 'leftTitle',
        type: 'string',
        validation: Rule => Rule.required()
    },
    {
        name: 'leftCTA',
        type: 'cta',
        title: 'Left CTA',
        description: 'Expand to see more options',
        validation: Rule => Rule.required()
    },
    {
        title: 'Right Title',
        name: 'rightTitle',
        type: 'text',
        validation: Rule => Rule.required()
    },
    {
        title: 'Right Subtitle',
        name: 'rightSubTitle',
        type: 'text',
        validation: Rule => Rule.required()
    },
    {
        name: 'rightCTA',
        type: 'cta',
        title: 'Right CTA',
        description: 'Expand to see more options',
        validation: Rule => Rule.required()
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Stay in Touch',
      }
    }
  }
}
