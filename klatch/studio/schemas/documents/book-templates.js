import React from 'react'
import { BookOpen } from 'phosphor-react'

import { getSwatch } from '../../lib/helpers'

export default {
  title: 'Book Templates',
  icon: () => <BookOpen />,
  name: 'bookTemplate',
  type: 'document',
  fields: [
    {
      type: 'string',
      name: 'name',
      title: 'Book Template Name'
    },
    {
      title: 'Template Type',
      name: 'type',
      type: 'string',
      options: {
        list: [
          {
            title: 'Quiz Template',
            description: 'Quiz Template',
            value: 'quiz'
          },
          {
            title: 'Espresso Template',
            description: 'Espresso Template',
            value: 'espresso'
          },
          {
            title: 'Single Beans Template',
            description: 'Single Beans Template',
            value: 'singleBeans'
          },
          {
            title: 'Beans Blend Template',
            description: 'Beans Blend Template',
            value: 'beansBlend'
          }
        ]
      }
    },
    {
      title: 'Left Images',
      name: 'leftImg',
      type: 'object',
      fields: [
        {
          title: 'First Image',
          type: 'image',
          description: 'First Image',
          name: 'firstImage'
        },
        {
          title: 'Second Image',
          type: 'image',
          description: 'Second Image',
          name: 'secondImage',
          hidden: ({ parent }) => {
            return parent.type === 'espresso'
          }
        }
      ],
      options: { collapsible: true }
    },
    {
      title: 'Right Images',
      name: 'rightImg',
      type: 'object',
      fields: [
        {
          title: 'First Image',
          type: 'image',
          description: 'First Image',
          name: 'firstImage'
        },
        {
          title: 'Second Image',
          type: 'image',
          description: 'Second Image',
          name: 'secondImage',
          hidden: ({ parent }) => {
            return parent.type === 'espresso'
          }
        }
      ],
      options: { collapsible: true },
      validation: Rule => Rule.required()
    }
  ]
}
