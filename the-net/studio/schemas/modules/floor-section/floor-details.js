import { Info } from 'phosphor-react'

export default {
  title: 'FLOOR - Floor Details',
  name: 'floorDetails',
  type: 'object',
  icon: Info,
  fields: [
    {
      title: 'Floors List',
      name: 'floorsList',
      type: 'array',
      of: [
        {
          title: 'Floor',
          name: 'floor',
          type: 'object',
          fields: [
            {
              title: 'Floor Name',
              name: 'floorName',
              type: 'string'
            },
            {
              title: 'Multiple Floors',
              name: 'multipleFloors',
              type: 'boolean',
              intialValue: false
            },
            {
              title: 'Lowest Floor Height',
              name: 'lowestFloorHeight',
              type: 'number'
            },
            {
              title: 'Highest Floor Height',
              name: 'highestFloorHeight',
              type: 'number',
              hidden: ({ parent }) => !parent.multipleFloors
            },
            {
              title: 'Floor Properties',
              name: 'floorProperties',
              type: 'array',
              of: [{ type: 'string' }]
            },

            {
              title: 'Floor Plans PDF',
              name: 'floorPlansPDF',
              type: 'file'
            },
            {
              title: 'Floor Plans Image',
              name: 'floorPlansImage',
              type: 'image'
            },
            {
              title: 'Panoramic View (Placeholder)',
              name: 'panoramicView',
              type: 'image'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Floor Details'
      }
    }
  }
}
