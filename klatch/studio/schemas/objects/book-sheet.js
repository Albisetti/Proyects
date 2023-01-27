import { Notebook } from 'phosphor-react'

export default {
  title: 'Book Sheet',
  icon: Notebook,
  name: 'bookSheet',
  type: 'object',
  fields: [
    {
      title: 'Page Type',
      name: 'pageType',
      type: 'string',
      options: {
        list: [
          { title: 'Page with Sticky Notes', value: 'sticky'},
          { title: 'Page with Polaroid', value: 'polaroid'},
          { title: 'Page with only text', value: 'general'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      title: 'Notes',
      type: 'array',
      name: 'notes',
      of: [{type: 'stickyNote'}],
      hidden: ({ parent }) => {
        return parent.pageType !== "sticky"
      }
    },
    {
      title: 'Title',
      type: 'string',
      name: 'title',
      hidden: ({ parent }) => {
        return parent.pageType === "sticky"
      }
    },
    {
      title: 'Content Block',
      type: 'text',
      name: 'contentBlock',
      hidden: ({ parent }) => {
        return parent.pageType === "sticky"
      }
    },
    {
      title: 'Subtitle',
      type: 'string',
      name: 'subtitle',
      hidden: ({ parent }) => {
        return parent.pageType !== "general"
      }
    },
    {
      title: 'Content Block # 2',
      type: 'text',
      name: 'contentBlockTwo',
      hidden: ({ parent }) => {
        return parent.pageType !== "general"
      }
    },
    {
      title: 'Polaroid Type',
      name: 'polaroidType',
      type: 'string',
      options: {
        list: [
          { title: 'Photo', value: 'photo'},
          { title: 'Video', value: 'video'},
        ]
      },
      hidden: ({ parent }) => {
        return (parent.pageType !== "polaroid")
      }
    },
    {
      title: 'Polaroid',
      type: 'image',
      name: 'polaroid',
      hidden: ({ parent }) => {
        return (parent.polaroidType !== "photo")
      }
    },
    {
      title: 'Video Type',
      name: 'videoType',
      type: 'string',
      options: {
        list: [
          { title: 'Upload', value: 'upload'},
          { title: 'Url', value: 'url'},
        ]
      },
      hidden: ({ parent }) => {
        return (parent.polaroidType !== "video")
      }
    },
    {
      title: 'Video Background',
      type: 'image',
      name: 'videoBackground',
      hidden: ({ parent }) => {
        return (parent.polaroidType !== "video")
      }
    },
    {
      title: 'Video Upload',
      type: 'file',
      name: 'polaroidVideo',
      hidden: ({ parent }) => {
        return (parent.videoType !== "upload")
      }
    },
    {
      title: 'Video Url',
      type: 'string',
      name: 'videoUrl',
      hidden: ({ parent }) => {
        return (parent.videoType !== "url")
      }
    },
  ],
  preview: {
    select: {
      type: 'pageType'
    },
    prepare({ type }) {
      return {
        title: `${type.replace(/^\w/, c => c.toUpperCase())} sheet`
      }
    }
  }
}