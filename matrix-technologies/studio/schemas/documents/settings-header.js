export default {
  title: 'Header Settings',
  name: 'headerSettings',
  type: 'document',
  // __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    { title: 'Logo', name: 'logo', type: 'image' },
    {
      title: 'Header Menu',
      name: 'menu',
      type: 'reference',
      to: [{ type: 'menu' }],
    },
    {
      title: 'Emergency Support Message',
      description: 'This message will appear on top of the page',
      name: 'emergencySupportMessage',
      type: 'text',
      rows: 1,
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Header Settings',
      }
    },
  },
}
