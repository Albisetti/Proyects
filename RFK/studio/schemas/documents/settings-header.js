import { Circle, Square } from 'phosphor-react'

export default {
  title: 'Header Settings',
  name: 'headerSettings',
  type: 'document',
  fields: [
    {
      title: 'Logo Image',
      name: 'logoImg',
      type: 'image'
    },
    {
      title: 'Logo Image Bright Mode',
      name: 'logoImgBright',
      type: 'image'
    },
    {
      title: 'Navigation Items',
      name: 'navItems',
      type: 'array',
      of: [
        {
          title: 'Navigation Item',
          name: 'navItem',
          icon: Square,
          type: 'object',
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              title: 'Item Type',
              name: 'type',
              type: 'string',
              options: {
                list: [
                  { title: 'Dropdown - Small', value: 'dropdownSmall' },
                  {
                    title: 'Dropdown - Medium (3 cols)',
                    value: 'dropdownMedium'
                  },
                  {
                    title: 'Dropdown - Large (4 cols)',
                    value: 'dropdownLarge'
                  },
                  { title: 'Roll Over (direct link)', value: 'rollOver' }
                ]
              }
            },
            {
              title: 'Dropdown Menu Items',
              name: 'dropdownSmallMenu',
              type: 'reference',
              to: [{ type: 'menu' }],
              hidden: ({ parent }) => parent.type !== 'dropdownSmall'
            },
            {
              title: 'Dropdown Menu Items',
              name: 'dropdownMediumMenu',
              type: 'array',
              of: [
                {
                  title: 'Menu Links List',
                  name: 'menuLinks',
                  type: 'object',
                  fields: [
                    {
                      title: 'Title',
                      name: 'title',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      title: 'Column',
                      name: 'column',
                      type: 'number',
                      description:
                        'Column to be positioned in within the dropdown menu',
                      options: {
                        list: [
                          { title: 'First', value: 1 },
                          { title: 'Second', value: 2 },
                          { title: 'Third', value: 3 },
                          {
                            title: 'Fourth (for large dropdown menu)',
                            value: 4
                          }
                        ]
                      },
                      validation: Rule => Rule.required()
                    },
                    {
                      title: 'Menu',
                      name: 'menu',
                      type: 'reference',
                      to: [{ type: 'menu' }]
                    }
                  ],
                  preview: {
                    select: {
                      linksTitle: 'title',
                      col: 'column'
                    },
                    prepare({ linksTitle, col }) {
                      return {
                        title: linksTitle,
                        subtitle: `Column ${col}`
                      }
                    }
                  }
                }
              ],
              hidden: ({ parent }) =>
                parent.type !== 'dropdownMedium' &&
                parent.type !== 'dropdownLarge'
            },
            {
              title: 'Navigation Item Link',
              name: 'navLink',
              type: 'reference',
              to: [{ type: 'page' }],
              hidden: ({ parent }) => parent.type !== 'rollOver'
            }
          ],
          preview: {
            select: {
              itemTitle: 'title',
              type: 'type'
            },
            prepare({ itemTitle, type }) {
              return {
                title: itemTitle || 'Nav Item',
                subtitle:
                  type === 'dropdownSmall'
                    ? 'Dropdown - Small'
                    : type === 'dropdownMedium'
                    ? 'Dropdown - Medium (3 cols)'
                    : type === 'dropdownLarge'
                    ? 'Dropdown - Large (4 cols)'
                    : type === 'rollOver'
                    ? 'Roll Over (direct link)'
                    : null
              }
            }
          }
        }
      ]
    },
    {
      title: 'Buttons List',
      name: 'buttons',
      type: 'array',
      of: [
        {
          title: 'Button',
          name: 'button',
          type: 'object',
          icon: Circle,
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              title: 'Filled Background',
              name: 'bgFilled',
              type: 'boolean',
              initialValue: false
            },
            {
              title: 'Link Type',
              name: 'linkType',
              type: 'string',
              description: 'Internal or External URL',
              options: {
                list: [
                  { title: 'Internal', value: 'internal' },
                  { title: 'External', value: 'external' }
                ],
                layout: 'radio',
                direction: 'horizontal'
              },
              initialValue: 'internal'
            },
            {
              title: 'Page Link',
              name: 'pageLink',
              type: 'reference',
              to: [{ type: 'page' }],
              hidden: ({ parent }) => {
                return parent.linkType !== 'internal'
              }
            },
            {
              title: 'External Link',
              name: 'externalLink',
              type: 'url',
              hidden: ({ parent }) => {
                return parent.linkType !== 'external'
              }
            }
          ],
          preview: {
            select: {
              buttonTitle: 'title',
              link: 'pageLink.slug.current'
            },
            prepare({ buttonTitle, link }) {
              return {
                title: buttonTitle,
                subtitle: !!link ? `/${link}` : null
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Header Settings'
      }
    }
  }
}
