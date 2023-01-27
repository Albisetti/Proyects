import S from '@sanity/desk-tool/structure-builder'

import { Student } from 'phosphor-react'

export const trainingClassesMenu = S.listItem()
  .title('Training Classes')
  .child(S.documentTypeList('trainingClass').title('Training Classes'))
  .icon(Student)
