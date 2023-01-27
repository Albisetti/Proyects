import { Cards } from 'phosphor-react'

export default {
  title: 'Shop Collection Display',
  name: 'shopCollectionDisplay',
  type: 'object',
  icon: Cards,
  fields: [
    {
      title: 'Collections',
      name: 'collections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'collection' }] }]
    }
  ],
  preview: {
    select: {
      collections: 'collections.length'
    },
    prepare({ collections }) {
      return {
        title: 'Shop Collection Display',
        subtitle: collections
          ? `${collections} collection${collections === 1 ? '' : 's'}`
          : null
      }
    }
  }
}
