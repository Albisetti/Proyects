import { Star } from 'phosphor-react'

export default {
  title: 'Two Col CTA',
  name: 'twoColCTA',
  type: 'object',
  icon: Star,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      title: 'Title Size',
      type: 'string',
      name: 'titleSize',
      options: {
        list: [
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
        ]
      }
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'text'
    },
    {
      title: 'Subtitle Size',
      type: 'string',
      name: 'subTitleSize',
      options: {
        list: [
          {title: 'Large', value: 'large'},
          {title: 'Regular', value: 'regular'},
        ]
      }
    },
    {
      name: 'cta',
      type: 'cta',
      title: 'CTA Button',
      description: 'Main module button, expand to see more.',
    },
    {
      title: 'Collage Type',
      name: 'collageType',
      type: 'string',
      options: {
        list: [
          { title: 'Product & Animal Collage', value: "productAnimal"},
          { title: 'Product & Coffee Collage', value: "productCoffee"},
          { title: 'Product & People Collage', value: "productPeople"},
        ]
      },
      layout: 'radio',
      direction: 'horizontal',
    },
    {
      title: 'Product & Animal Collage',
      name: 'assetsAnimal',
      type: 'object',
      fields: [
        { title: 'Background Image', type: 'image', name: 'firstImg' },
        { title: 'Text annotation', type: 'text', name: 'annotation', description: 'Text animation on top right corner'},
        { title: 'Animal Image', type: 'image', name: 'secondImg'},
        { title: 'Product Image', type: 'image', name: 'thirdImg'},
        { title: 'Annotation Image', type: 'image', name: 'fourthImg'},
      ],
      hidden: ({ parent }) => {
        return parent.collageType !== "productAnimal"
      }
    },
    {
      title: 'Product & Coffee Collage',
      name: 'assetsCoffee',
      type: 'object',
      fields: [
        { title: 'Beans Image', type: 'image', name: 'firstImg' },
        { title: 'Coffee Image', type: 'image', name: 'secondImg'},
        { title: 'Product Image', type: 'image', name: 'thirdImg'},
        { title: 'Heart Image', type: 'image', name: 'fourthImg'},
      ],
      hidden: ({ parent }) => {
        return parent.collageType !== "productCoffee"
      }
    },
    {
      title: 'Product & People Collage',
      name: 'assetsPeople',
      type: 'object',
      fields: [
        { title: 'Left People Image', type: 'image', name: 'firstImg' },
        { title: 'Center People Image', type: 'image', name: 'secondImg'},
        { title: 'Product Image', type: 'image', name: 'thirdImg'},
      ],
      hidden: ({ parent }) => {
        return parent.collageType !== "productPeople"
      }
    },
    {
      title: 'Block Flow',
      name: 'direction',
      type: 'string',
      options: {
        list: [
          {
            value: "leftToRight",
            title: 'Left to Right'
          },{
            value: "rightToLeft",
            title: 'Right to Left'
          }
        ]
      },
      initialValue: "leftToRight",
      validation: Rule => Rule.required()
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'Two Col CTA',
        subtitle: title,
      }
    }
  }
}
