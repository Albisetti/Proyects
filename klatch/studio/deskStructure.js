import S from '@sanity/desk-tool/structure-builder'

import { settingsMenu } from './desk/settings'
import { pagesMenu } from './desk/pages'
import { shopMenu } from './desk/shop'
import { menusMenu } from './desk/menus'
import { cafesMenu } from './desk/cafes'
import { brewGuidesMenu } from './desk/brew-guides'
import { trainingClassesMenu } from './desk/training-classes'
import { blogPostsMenu } from './desk/blog-posts'

const hiddenDocTypes = listItem =>
  ![
    'page',
    'product',
    'productVariant',
    'collection',
    'filter',
    'solidColor',

    'generalSettings',
    'cookieSettings',
    'promoSettings',
    'headerSettings',
    'footerSettings',
    'shopSettings',
    'seoSettings',

    'menu',
    'cafe',
    'brewGuide',
    'author',
    'blogPost',
    'category',
    'comment',
    'tastingTrainingCategory',
    'tastingTrainingItem',
    'siteSettings',
    'redirect',
    'media.tag' // for media plugin
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Website')
    .items([
      pagesMenu,
      blogPostsMenu,
      S.divider(),
      shopMenu,
      S.divider(),
      menusMenu,
      S.divider(),
      cafesMenu,
      brewGuidesMenu,
      trainingClassesMenu,
      S.divider(),
      settingsMenu,

      // Filter out docs already defined above
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
