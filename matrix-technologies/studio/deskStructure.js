import S from '@sanity/desk-tool/structure-builder'

import { settingsMenu } from './desk/settings'
import { pagesMenu } from './desk/pages'
import { postsMenu } from './desk/posts'
import { shopMenu } from './desk/shop'
import { menusMenu } from './desk/menus'

const hiddenDocTypes = (listItem) =>
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
    'settingsLink',

    'author',
    'postCategory',
    'post',

    'menu',
    'siteSettings',
    'redirect',
    'media.tag', // for media plugin
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Website')
    .items([
      pagesMenu,
      S.divider(),
      postsMenu,
      S.divider(),
      shopMenu,
      S.divider(),
      menusMenu,
      S.divider(),
      settingsMenu,

      // Filter out docs already defined above
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
