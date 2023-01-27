import { LinkSimpleHorizontal } from 'phosphor-react'

import { getStaticRoute, getDynamicRoute } from '../../lib/helpers'

export default {
  title: 'Page',
  name: 'navPage',
  type: 'object',
  icon: LinkSimpleHorizontal,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Display Text',
    },
    {
      title: 'Page',
      name: 'page',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'collection' }, { type: 'product' }],
    },
    {
      title: 'Parameters',
      name: 'parameters',
      type: 'string',
      description: 'Anchor, query parameters, etc.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      pageType: 'page._type',
      pageSlug: 'page.slug.current',
      parameters: 'parameters',
    },
    prepare({ title, pageType, pageSlug, parameters = '' }) {
      const isStatic = getStaticRoute(pageType)
      const isDynamic = getDynamicRoute(pageType)
      const slug = parameters ? pageSlug + parameters : pageSlug

      return {
        title: title,
        subtitle:
          isStatic !== false
            ? `/${isStatic}`
            : `/${isDynamic ? `${isDynamic}/` : ''}${slug}`,
      }
    },
  },
}
