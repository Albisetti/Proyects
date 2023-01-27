import S from '@sanity/desk-tool/structure-builder'

import { Coffee } from 'phosphor-react'

export const cafesMenu = S.listItem()
  .title('Cafes')
  .child(S.documentTypeList('cafe').title('Cafes'))
  .icon(Coffee)
