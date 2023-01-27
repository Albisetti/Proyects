import { Cards, Tag } from 'phosphor-react'

export default {
  title: 'Tags Slider',
  name: 'tagsSlider',
  type: 'object',
  icon: Cards,
  fields: [
    {
      title: 'Tags',
      name: 'tags',
      type: 'array',
      of: [
        {
          title: 'Tag Item',
          name: 'tagItem',
          type: 'object',
          icon: Tag,
          fields: [
            {
              title: 'Reviewer Name',
              name: 'reviewerName',
              type: 'string'
            },
            {
              title: 'Rating Score',
              name: 'rating',
              type: 'number',
              description:
                'Number from 1 to 5. This will be displayed in the tag as stars',
              validation: Rule => Rule.min(1).max(5)
            },
            {
              title: 'Review Title',
              name: 'reviewTitle',
              type: 'string'
            },
            {
              title: 'Preview Text',
              name: 'previewText',
              type: 'string',
              description:
                'Text that will be displayed on the tag. If not set, the first two lines from the review text will be used instead'
            },
            {
              title: 'Review Text',
              name: 'reviewText',
              type: 'text'
            }
          ],
          preview: {
            select: {
              reviewer: 'reviewerName',
              reviewTitle: 'reviewTitle'
            },
            prepare({ reviewer, reviewTitle }) {
              return {
                title: reviewer,
                subtitle: reviewTitle
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      tags: 'tags.length'
    },
    prepare({ tags }) {
      return {
        title: 'Tags Slider',
        subtitle: `${tags || 'No'} tag item${tags === 1 ? '' : 's'}`
      }
    }
  }
}
