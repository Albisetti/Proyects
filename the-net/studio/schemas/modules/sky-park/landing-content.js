import { Article } from 'phosphor-react'

export default {
  title: 'SKY PARK - Landing Content',
  name: 'landingContent',
  type: 'object',
  icon: Article,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Subtitle Bullets',
      name: 'subtitleBullets',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      title: 'Carousel',
      name: 'carousel',
      type: 'carousel'
    },
    { title: 'Image', name: 'image', type: 'image' },
    { title: 'Gallery Arrow', name: 'galleryArrow', type: 'link' },
    {
      title: 'Entrance Video',
      name: 'video',
      type: 'file',
      options: { accept: 'video/*' }
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Landing Content'
      }
    }
  }
}
