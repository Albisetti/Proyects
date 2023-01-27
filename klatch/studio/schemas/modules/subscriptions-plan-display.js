import { Gift, Star } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Subscriptions Plan Display',
  name: 'subscriptionsPlanDisplay',
  type: 'object',
  icon: Star,
  fields: [
    customImage({
      title: 'Background Image',
      name: 'backgroundImage'
    }),
    {
      title: 'Featured Subscription Plans',
      name: 'subscriptionPlans',
      type: 'array',
      of: [
        {
          title: 'Subscription Plan',
          name: 'subscriptionPlan',
          type: 'object',
          fields: [
            {
              title: 'Plan Product',
              name: 'planProduct',
              type: 'reference',
              to: [{ type: 'product' }],
              options: {
                filter: '(title match "club subscription")'
              }
            },
            {
              title: 'Gift Subscriptions Description',
              name: 'giftDescription',
              type: 'simplePortableText',
              description:
                'Text to display above the gift subscriptions choice section'
            },
            {
              title: 'Gift Subscriptions for this Plan',
              name: 'planGifts',
              type: 'array',
              of: [
                {
                  title: 'Gift Subscription Plan',
                  name: 'giftSubscription',
                  type: 'object',
                  icon: Gift,
                  fields: [
                    {
                      title: 'Cart Button Title',
                      name: 'buttonTitle',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      title: 'Gift Subscription Plan',
                      name: 'giftPlanProduct',
                      type: 'reference',
                      to: [{ type: 'product' }],
                      options: {
                        filter: '(title match "gift subscription")'
                      },
                      validation: Rule => Rule.required()
                    }
                  ],
                  preview: {
                    select: {
                      giftProduct: 'giftPlanProduct.title'
                    },
                    prepare({ giftProduct }) {
                      return {
                        title: 'Gift Subscription Plan',
                        subtitle: giftProduct || null
                      }
                    }
                  }
                }
              ],
              validation: Rule => Rule.max(3)
            }
          ],
          preview: {
            select: {
              product: 'planProduct.title'
            },
            prepare({ product }) {
              return {
                title: 'Subscription Plan',
                subtitle: product || null
              }
            }
          }
        }
      ],
      validation: Rule =>
        Rule.required()
          .min(1)
          .max(3)
    }
  ],
  preview: {
    select: {
      subPlans: 'subscriptionPlans.length'
    },
    prepare({ subPlans }) {
      return {
        title: 'Subscriptions Plan Display',
        subtitle: `${subPlans || 'No'} featured plan${
          subPlans === 1 ? '' : 's'
        }`
      }
    }
  }
}
