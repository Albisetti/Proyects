import { Notebook } from 'phosphor-react'

export default {
  title: 'Brew Guide',
  name: 'brewGuide',
  type: 'document',
  icon: Notebook,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      validation: Rule => Rule.required()
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      validation: Rule => Rule.required()
    },
    {
      title: 'Image Caption',
      name: 'imageCaption',
      type: 'string'
    },
    {
      title: 'PDF Text',
      name: 'printablePDFText',
      type: 'string',
      initialValue: 'Printable PDF'
    },
    {
      title: 'PDF File',
      name: 'printablePDF',
      type: 'file'
    },
    {
      title: 'Video Type',
      name: 'videoType',
      type: 'string',
      options: {
        list: [
          { title: 'Upload', value: 'upload' },
          { title: 'Embed URL', value: 'embed' }
        ],
        layout: 'radio',
        direction: 'horizontal'
      }
    },
    {
      title: 'Video Upload',
      name: 'videoUpload',
      type: 'file',
      hidden: ({ parent }) => {
        return parent.videoType !== 'upload'
      }
    },
    {
      title: 'Video Embed URL',
      name: 'videoEmbedURL',
      type: 'string',
      hidden: ({ parent }) => {
        return parent.videoType !== 'embed'
      }
    },
    {
      title: 'Video Preview Image',
      name: 'videoPreviewImage',
      type: 'image'
    },
    {
      title: 'Details',
      name: 'details',
      type: 'array',
      of: [{ type: 'keyValue' }]
    },
    {
      title: 'Steps',
      name: 'steps',
      type: 'complexPortableText'
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      title: 'name',
      slug: 'slug',
      media: 'image'
    },
    prepare({ title = 'Untitled', slug = {}, media }) {
      return {
        title,
        subtitle: slug && slug.current ? slug.current : '',
        media
      }
    }
  }
}
