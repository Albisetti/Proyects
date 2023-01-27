import { Square, SquaresFour } from 'phosphor-react'

export default {
  title: 'Careers - Job Blocks',
  name: 'careersJobBlocks',
  type: 'object',
  icon: SquaresFour,
  fields: [
    {
      title: 'Job Blocks',
      name: 'jobBlocks',
      type: 'array',
      of: [
        {
          title: 'Job Block',
          name: 'jobBlock',
          type: 'object',
          icon: Square,
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            },
            {
              title: 'Description',
              name: 'description',
              type: 'text'
            },
            {
              title: 'Image',
              name: 'image',
              type: 'image'
            },
            {
              title: 'Job Link',
              name: 'jobLink',
              type: 'cta'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      blockCount: 'jobBlocks.length'
    },
    prepare({ blockCount }) {
      return {
        title: 'Careers - Job Blocks',
        subtitle: `${blockCount} job block${blockCount === 1 ? '' : 's'}`
      }
    }
  }
}
