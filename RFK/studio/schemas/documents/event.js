import { Calendar } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Event',
  name: 'event',
  type: 'document',
  icon: Calendar,
  fieldsets: [
    {
      title: 'Event Details',
      name: 'eventDetails',
      options: {
        columns: 2
      }
    }
  ],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      description: '(required)',
      options: {
        source: 'title',
        maxLength: 98
      },
      validation: Rule => Rule.required()
    },
    {
      title: 'Category',
      name: 'category',
      type: 'reference',
      to: [{ type: 'eventCategory' }]
    },
    {
      title: 'Date & Time',
      name: 'scheduledFor',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'h:mm',
        timeStep: 15,
        calendarTodayLabel: 'Today'
      },
      fieldset: 'eventDetails',
      validation: Rule => Rule.required()
    },
    {
      title: 'Location',
      name: 'location',
      type: 'string',
      fieldset: 'eventDetails'
    },
    {
      title: 'Registration Link',
      name: 'registrationLink',
      type: 'link',
      fieldset: 'eventDetails'
    },
    {
      title: 'Visibility',
      name: 'visibility',
      type: 'string',
      fieldset: 'eventDetails',
      options: {
        list: [
          { title: 'Visible', value: 'visible' },
          { title: 'Hidden', value: 'hidden' }
        ],
        layout: 'radio',
        direction: 'horizontal'
      },
      initialValue: 'visible'
    },
    {
      title: 'Speaker',
      name: 'speaker',
      type: 'string'
    },
    customImage({ title: 'Featured Image', name: 'featuredImage' }),
    {
      title: 'Content',
      name: 'content',
      type: 'complexPortableText'
    },
    {
      title: 'Excerpt',
      name: 'excerpt',
      type: 'text',
      rows: 4,
      description: 'A short description of the event.',
      validation: Rule => Rule.max(240)
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      title: 'title',
      datetime: 'scheduledFor',
      media: 'featuredImage'
    },
    prepare({ title = 'Untitled', datetime, media }) {
      return {
        title,
        subtitle: new Date(datetime).toDateString(),
        media
      }
    }
  }
}
