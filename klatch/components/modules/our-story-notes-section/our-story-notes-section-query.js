import { imageMeta } from 'data/utils'

export const ourStoryNotesSectionQuery = `_type == 'ourStoryNotesSection' => {
    _type,
    _key,
    title,
    content,
    leftNoteTitle,
    leftNotes[],
    firstPolaroidImg{
      ${imageMeta}
    },
    secondPolaroidImg{
      ${imageMeta}
    }
  }`
