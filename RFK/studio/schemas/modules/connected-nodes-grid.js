import { Graph } from 'phosphor-react'

export default {
  title: 'Connected Nodes',
  name: 'connectedNodes',
  type: 'object',
  icon: Graph,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Module main title'
    },
    {
      title: 'Background Color',
      name: 'bgColor',
      type: 'color',
      description: 'Section background color',
      options: {
        disableAlpha: true
      }
    },
    {
      title: 'Content Grid',
      type: 'object',
      name: 'contentGrid',
      fields: [
        {
          title: 'First Column',
          type: 'object',
          name: 'firstColumn',
          options: { collapsible: true},
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            }, 
            {
              title: 'Node Color',
              name: 'color',
              type: 'color',
              description: 'Background color for the node tiles in this column',
              options: {
                disableAlpha: true
              }
            },
            {
              title: 'Nodes',
              name: 'nodes',
              type: 'array',
              of: [{
                type: 'object',
                fields: [{
                  title: 'Node Title',
                  name: 'title',
                  type: 'string'
                },
                {
                  title: 'Node Icon',
                  name: 'icon',
                  type: 'image'
                }]
              }]
            }
          ]
        },
        {
          title: 'Second Column',
          type: 'object',
          name: 'secondColumn',
          options: { collapsible: true},
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            }, 
            {
              title: 'Node Color',
              name: 'color',
              type: 'color',
              description: 'Background color for the node tiles in this column',
              options: {
                disableAlpha: true
              }
            },
            {
              title: 'Nodes',
              name: 'nodes',
              type: 'array',
              of: [{
                type: 'object',
                fields: [{
                  title: 'Node Title',
                  name: 'title',
                  type: 'string'
                },
                {
                  title: 'Node Icon',
                  name: 'icon',
                  type: 'image'
                }]
              }]
            }
          ]
        },
        {
          title: 'Third Column',
          type: 'object',
          name: 'thirdColumn',
          options: { collapsible: true},
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            }, 
            {
              title: 'Node Color',
              name: 'color',
              type: 'color',
              description: 'Background color for the node tiles in this column',
              options: {
                disableAlpha: true
              }
            },
            {
              title: 'Nodes',
              name: 'nodes',
              type: 'array',
              of: [{
                type: 'object',
                fields: [{
                  title: 'Node Title',
                  name: 'title',
                  type: 'string'
                },
                {
                  title: 'Node Icon',
                  name: 'icon',
                  type: 'image'
                }]
              }]
            }
          ]
        }
      ],
      validation: Rule => Rule.required()
    },
    
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: 'Connected Nodes',
        subtitle: title
      }
    }
  }
}
