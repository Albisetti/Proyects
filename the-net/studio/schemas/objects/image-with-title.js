export default {
  title: 'GLOBAL - Image with title',
  name: 'imageWithTitle',
  type: 'object',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'complexPortableText'
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image'
    }
  ],
  preview: {
    select: {
      imageTitle: 'title',
      img: 'image'
    },
    prepare({ imageTitle, img }) {
      return {
        title: imageTitle,
        media: img
      }
    }
  }
}
