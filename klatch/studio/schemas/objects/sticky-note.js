import { Note } from 'phosphor-react'

export default {
  title: 'Sticky Note',
  icon: Note,
  name: 'stickyNote',
  type: 'object',
  fields: [
    {
      title: 'Title',
      type: 'string',
      description: 'Sticky Note Main Title',
      name: 'title',
      validation: Rule => Rule.required()
    },
    {
      type: 'string',
      title: 'Sticky Note Type',
      description: 'Defines decorations and icons on the note',
      name: 'type',
      options: {
        list: [
          { title: 'Flavor Note', value: 'flavor'},
          { title: 'General Note', value: 'general'},
          { title: 'Roast Note', value: 'roast'},
        ],
      },
      validation: Rule => Rule.required()
    },
    {
      type: "text",
      title: 'Note description',
      description: '1-3 lines of text',
      name: 'description',
      hidden: ({ parent }) => {
        return parent.type === "roast"
      }
    },
    {
      type: "string",
      title: 'Process',
      description: 'process',
      name: 'process',
      hidden: ({ parent }) => {
        return parent.type !== "flavor"
      }
    },
    {
      type: 'string',
      name: "roast",
      title: 'Roast Type',
      options: {
        list:[
          {title: 'Light', value: 'light'},
          {title: 'Medium', value: 'medium'},
          {title: 'Strong', value: 'strong'}
        ]
      },
      hidden: ({ parent }) => {
        return parent.type !== "roast"
      }
    },
    {
      type: "string",
      name: "color",
      options: {
        list: [
          {title: 'Orange', value: 'orange'},
          {title: 'Green', value: 'green'},
          {title: 'Pink', value: 'pink'},
          {title: 'Blue', value: 'blue'},
        ]
      }
    },
  ],
  preview: {
    prepare(){
      return {
        title: 'Sticky Note'        
      }
    }
  }
}