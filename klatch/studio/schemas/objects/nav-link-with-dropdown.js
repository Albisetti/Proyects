import { DotsThreeCircleVertical } from 'phosphor-react'

export default {
  title: 'Link with Dropdown',
  name: 'navLinkWithDropdown',
  type: 'object',
  icon: DotsThreeCircleVertical,
  fields: [
    {
      title: 'Link',
      name: 'link',
      type: 'navPage',
      description: 'The top-level link.',
      validation: Rule => Rule.required()
    },
    {
      title: 'Dropdown Items',
      name: 'dropdownItems',
      type: 'array',
      of: [{ type: 'navPage' }, { type: 'navLink' }]
    }
  ],
  preview: {
    select: {
      title: 'link.title',
      slug: 'link.page.slug.current',
      dropdownItems: 'dropdownItems'
    },
    prepare({ title, slug, dropdownItems }) {
      let subtitle = `/${slug}`
      if (dropdownItems && dropdownItems.length > 0) {
        subtitle = `/${slug} + ${dropdownItems &&
          dropdownItems.length} other items`
      }
      return {
        title,
        subtitle
      }
    }
  }
}
