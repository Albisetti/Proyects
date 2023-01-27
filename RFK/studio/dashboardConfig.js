export default {
  widgets: [
    {
      name: 'document-list',
      options: {
        title: 'Recently edited',
        order: '_updatedAt desc',
        limit: 10,
        types: ['page', 'product', 'collection']
      },
      layout: { width: 'medium' }
    },
    {
      name: 'project-info'
    },
    {
      name: 'amplify-deploy',
      options: {
        webhookURL: process.env.SANITY_STUDIO_BUILD_WEBHOOK_URL
      }
    }
  ]
}
