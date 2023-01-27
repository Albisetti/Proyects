import { Circle, User, Users } from 'phosphor-react'

export default {
  title: 'TEAM - Member Slides',
  name: 'teamMembers',
  type: 'object',
  icon: Users,
  fields: [
    {
      title: 'Slides',
      name: 'slides',
      type: 'array',
      of: [
        {
          name: 'slide',
          type: 'object',
          icon: User,
          fields: [
            {
              title: 'Tab Image',
              name: 'tabImage',
              type: 'image'
            },
            {
              title: 'Member',
              name: 'member',
              type: 'object',
              fields: [
                {
                  title: 'Name',
                  name: 'name',
                  type: 'string'
                },
                {
                  title: 'Photo',
                  name: 'photo',
                  type: 'image'
                },
                {
                  title: 'Description',
                  name: 'description',
                  type: 'complexPortableText'
                },
                {
                  title: 'Contact Info',
                  name: 'contactInfo',
                  type: 'array',
                  of: [
                    {
                      title: 'Contact',
                      name: 'contact',
                      type: 'object',
                      icon: Circle,
                      fields: [
                        {
                          title: 'Contact Type',
                          name: 'contactType',
                          type: 'string',
                          options: {
                            list: [
                              {
                                title: 'Email',
                                value: 'email'
                              },
                              {
                                title: 'Phone',
                                value: 'phone'
                              },
                              {
                                title: 'Page',
                                value: 'page'
                              }
                            ]
                          }
                        },
                        {
                          title: 'Contact',
                          name: 'contact',
                          type: 'string'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          preview: {
            select: {
              name: 'member.name'
            },
            prepare({ name }) {
              return {
                title: name
              }
            }
          }
        }
      ]
    }
  ],

  preview: {
    select: {
      itemCount: 'slides.length'
    },
    prepare({ itemCount }) {
      return {
        title: `Team Members (${itemCount} slide${itemCount === 1 ? '' : 's'})`
      }
    }
  }
}
