import { ListDashes } from 'phosphor-react'

export default {
  title: 'CTA Sections with Side Nav',
  name: 'ctaSectionsWithSideNav',
  type: 'object',
  icon: ListDashes,
  fields: [
    {
      title: 'CTA Sections',
      name: 'sections',
      type: 'array',
      of: [
        {
          type: 'ctaList'
        }
      ]
    }
  ],
  preview: {
    select: {
      sectionCount: 'sections.length'
    },
    prepare({ sectionCount = 0 }) {
      return {
        title: 'CTA Sections with Side Navigation',
        subtitle: `${sectionCount} section${sectionCount === 1 ? '' : 's'}`
      }
    }
  }
}
