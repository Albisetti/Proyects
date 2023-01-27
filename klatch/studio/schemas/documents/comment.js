export default {
  title: 'Comment',
  name: 'comment',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string'
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string'
    },
    {
      title: 'Comment',
      name: 'comment',
      type: 'text'
    },
    {
      name: 'childComments',
      title: 'Child Comments',
      type: 'array',
      of: [{ type: 'comment' }]
    },
    {
      title: 'Approved',
      name: 'approved',
      type: 'boolean'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'comment'
    }
  }
}
