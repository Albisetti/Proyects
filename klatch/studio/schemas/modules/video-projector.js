import { MonitorPlay } from 'phosphor-react'

export default {
  title: 'Video Projector',
  name: 'videoProjector',
  type: 'object',
  icon: MonitorPlay,
  fields: [
    {
      title: 'Title (optional)',
      name: 'title',
      type: 'string'
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
    }
  ],
  preview: {
    select: {
      videoTitle: 'title'
    },
    prepare({ videoTitle }) {
      return {
        title: 'Video Projector',
        subtitle: videoTitle
      }
    }
  }
}
