import S from '@sanity/desk-tool/structure-builder'

import { Note, Folders } from 'phosphor-react'

export const postsMenu = S.listItem()
  .title('Posts')
  .child(
    S.list()
      .title('Posts')
      .items([
        S.listItem()
          .title('Posts')
          .child(S.documentTypeList('post').title('Posts'))
          .icon(Note),
        S.divider(),
        S.listItem()
          .title('Post Categories')
          .child(S.documentTypeList('postCategory').title('Post Categories'))
          .icon(Folders)
      ])
  )
  .icon(Note)
