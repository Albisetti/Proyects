import { WaveSine } from 'phosphor-react'

export default {
  title: 'Wave Lines',
  name: 'waveLines',
  type: 'object',
  icon: WaveSine,
  fields: [
    {
      title: 'Inverted Version',
      name: 'inverted',
      type: 'boolean',
      initialValue: false
    },
    {
      title: 'Inverted: Alternate Color Scheme',
      name: 'invertedScheme',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => {
        return !parent.inverted
      }
    },
    {
      title: 'Add Spacing',
      name: 'spacing',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Wave Lines Decor'
      }
    }
  }
}
