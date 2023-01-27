import { ImageSquare } from 'phosphor-react'

export default {
  title: 'GLOBAL - Gallery Modal',
  name: 'galleryModal',
  type: 'object',
  icon: ImageSquare,
  fields: [
    {
      title: 'Slug',
      name: 'slug',
      type: 'string'
    },
    {
      title: 'Images',
      name: 'images',
      type: 'array',
      of: [{ type: 'imageWithTitle' }]
    }
  ],
  preview: {
    select: {
      slug: 'slug'
    },
    prepare({ slug }) {
      return {
        title: 'Gallery Modal',
        subtitle: slug
      }
    }
  }
}
