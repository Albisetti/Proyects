import S from '@sanity/desk-tool/structure-builder'

import { Calendar, Folders } from 'phosphor-react'

export const eventsMenu = S.listItem()
  .title('Events')
  .child(
    S.list()
      .title('Events')
      .items([
        S.listItem()
          .title('Events')
          .child(S.documentTypeList('event').title('Events'))
          .icon(Calendar),
        S.divider(),
        S.listItem()
          .title('Event Categories')
          .child(S.documentTypeList('eventCategory').title('Event Categories'))
          .icon(Folders)
      ])
  )
  .icon(Calendar)
