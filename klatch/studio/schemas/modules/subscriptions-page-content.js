import { Star } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Subscriptions Page Content',
  name: 'subscriptionsPageContent',
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
      type: 'text'
    },
    customImage({
      title: 'Left Image',
      name: 'leftImage'
    }),
    customImage({
      title: 'Right Image',
      name: 'rightImage'
    }),
    {
      title: 'Subscriptions Display',
      name: 'subscriptionsDisplay',
      type: 'subscriptionsPlanDisplay'
    }
  ],
  preview: {
    select: {
      heroTitle: 'title'
    },
    prepare({ heroTitle }) {
      return {
        title: 'Subscriptions Page Content',
        subtitle: heroTitle
      }
    }
  }
}
