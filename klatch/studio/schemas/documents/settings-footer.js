export default {
  title: 'Footer Settings',
  name: 'footerSettings',
  type: 'document',
  // __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Footer Menu',
      name: 'menu',
      description: 'Nav links',
      type: 'reference',
      to: [{ type: 'menu' }],
    },
    {
      title: 'Social Media Links',
      name: 'social',
      description: 'Links to Klatch social media',
      type: 'array', 
      of: [{type: 'navLink'}]
    },
    {
      title: 'Footer Image',
      name: 'image',
      description: 'Left Image on footer (PNG, transparent)',
      type: 'image'
    }
  ],  
  preview: {
    prepare() {
      return {
        title: 'Footer Settings'
      }
    }
  }
}
