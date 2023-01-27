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
      name: 'project-users'
    },
    {
      name: 'project-info'
    },
    {
      name: 'AmplifyDeployButton',
      options: {
        webhookUrls: ['https://webhooks.amplify.us-east-1.amazonaws.com/prod/webhooks?id=c70d059a-77c2-421e-b128-45000ee21403&token=6wGW2BMqVJN33kLg2EwND53xYNGiQJmnc6pInvNeg0'],
        title: 'Deploy content changes',
        buttonText: 'Deploy'
      }
    }
  ]
}
