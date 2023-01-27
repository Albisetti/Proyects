import { Cards } from 'phosphor-react'

export default {
  title: 'Products Slider',
  name: 'productsSlider',
  type: 'object',
  icon: Cards,
  fields: [
    {
      title: 'Slider Title (optional)',
      name: 'title',
      type: 'string',
      description: 'Optional title that will appear above the slider'
    },
    {
      title: 'Collection',
      name: 'collection',
      type: 'reference',
      description: 'Collection of products to display in the slider',
      to: [{ type: 'collection' }],
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      sliderTitle: 'title'
    },
    prepare({ sliderTitle }) {
      return {
        title: 'Products Slider',
        subtitle: sliderTitle
      }
    }
  }
}
