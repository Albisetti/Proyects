import { Student } from 'phosphor-react'

export default {
  title: 'Training Class',
  name: 'trainingClass',
  type: 'document',
  icon: Student,
  fields: [
    {
      title: 'Reference Class Product',
      name: 'classProduct',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: Rule => Rule.required()
    },
    {
      title: 'First Polaroid Video Type',
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
      title: 'First Polaroid Video Upload',
      name: 'videoUpload',
      type: 'file',
      hidden: ({ parent }) => {
        return parent.videoType !== 'upload'
      }
    },
    {
      title: 'First Polaroid Video Embed URL',
      name: 'videoEmbedURL',
      type: 'string',
      hidden: ({ parent }) => {
        return parent.videoType !== 'embed'
      }
    },
    {
      title: 'First Polaroid Video Preview Image',
      name: 'firstPolaroidImage',
      type: 'image'
    },
    {
      title: 'Second Polaroid Image',
      name: 'secondPolaroidImage',
      type: 'image'
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      title: 'classProduct.title',
      slug: 'classProduct.slug'
    },
    prepare({ title = 'Unknown', slug = {} }) {
      return {
        title,
        subtitle: slug && slug.current ? slug.current : ''
      }
    }
  }
}
