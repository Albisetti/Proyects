import { MonitorPlay } from 'phosphor-react'

export default {
  title: 'Video',
  name: 'video',
  type: 'object',
  icon: MonitorPlay,
  fields: [
    {
      title: 'Video Type',
      name: 'videoType',
      type: 'string',
      options: {
        list: [
          { title: 'Upload', value: 'upload' },
          { title: 'URL', value: 'embed' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'embed',
    },
    {
      title: 'Video Upload',
      name: 'videoUpload',
      type: 'file',
      hidden: ({ parent }) => {
        return parent.videoType !== 'upload'
      },
    },
    {
      title: 'Video Embed URL',
      name: 'videoEmbedURL',
      type: 'string',
      hidden: ({ parent }) => {
        return parent.videoType !== 'embed'
      },
    },
    {
      title: 'Video Preview Image',
      name: 'previewImage',
      type: 'image',
    },
    {
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'Use for linking to this section.',
    },
  ],
  preview: {
    select: {
      media: 'previewImage',
    },
    prepare({ media }) {
      return {
        title: 'Video',
        media,
      }
    },
  },
}
