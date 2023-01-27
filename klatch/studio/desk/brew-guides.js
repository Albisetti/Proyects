import S from '@sanity/desk-tool/structure-builder'

import { Notebook } from 'phosphor-react'

export const brewGuidesMenu = S.listItem()
  .title('Brew Guides')
  .child(S.documentTypeList('brewGuide').title('Brew Guides'))
  .icon(Notebook)
