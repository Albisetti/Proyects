import { Star } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Careers Page Content',
  name: 'careersPageContent',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Current Openings',
      name: 'currentOpenings',
      type: 'array',
      of: [
        {
          title: 'Opening',
          name: 'opening',
          type: 'object',
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            },
            {
              title: 'Description',
              name: 'description',
              type: 'text'
            }
          ]
        }
      ]
    },
    {
      title: 'E-Mail for Resumes',
      name: 'email',
      type: 'string',
      description: 'If set, will display an "Email Us Now" button'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Careers Page Content'
      }
    }
  }
}
