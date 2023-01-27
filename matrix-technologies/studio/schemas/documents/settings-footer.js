export default {
  title: 'Footer Settings',
  name: 'footerSettings',
  type: 'document',
  // __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Logo',
      name: 'logo',
      type: 'image',
    },
    {
      title: 'Hubspot Id',
      name: 'hubspotId',
      type: 'text',
      rows: 1,
    },
    {
      title: 'Social Links',
      name: 'social',
      type: 'array',
      of: [{ type: 'socialLink' }],
    },
    {
      title: 'Terms of Use Link',
      name: 'termsOfUse',
      type: 'array',
      of: [{ type: 'link' }],
    },
    {
      title: 'List of Links By Category',
      name: 'linksByCategory',
      type: 'array',
      of: [
        {
          title: 'Category',
          name: 'category',
          type: 'object',
          fields: [
            {
              title: 'Category Name',
              name: 'categoryName',
              type: 'array',
              of: [{ type: 'link' }],
            },
            {
              title: 'List of Links',
              name: 'linkList',
              type: 'array',
              of: [{ type: 'link' }],
            },
          ],
          preview: {
            // select: {
            //   titleLink: 'categoryName',
            // },
            prepare({ titleLink }) {
              return {
                title: 'Category',
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      media: 'productImage',
    },
    prepare() {
      return {
        title: 'footer settings',
      }
    },
  },
}
