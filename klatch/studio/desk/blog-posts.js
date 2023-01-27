import S from '@sanity/desk-tool/structure-builder'

import { Note } from 'phosphor-react'

export const blogPostsMenu = S.listItem()
  .title('Blog')
  .child(S.documentTypeList('blogPost').title('Blog Posts'))
  .icon(Note)
