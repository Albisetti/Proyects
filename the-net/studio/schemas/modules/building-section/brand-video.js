import { VideoCamera } from 'phosphor-react'

export default {
  title: 'BUILDING - Brand Video',
  name: 'brandVideo',
  type: 'object',
  icon: VideoCamera,
  fields: [
    {
      title: 'Video',
      name: 'video',
      type: 'file',
      options: { accept: 'video/*' }
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Brand Video'
      }
    }
  }
}
