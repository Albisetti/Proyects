import { WarningCircle } from 'phosphor-react'

export default {
  title: 'Header Settings',
  name: 'headerSettings',
  type: 'document',
  // __experimental_actions: ['update', 'publish'], // disable for initial publish
  fieldsets: [
    {
      title: 'Menu',
      name: 'desktop',
      description: 'Navigation settings for desktop view',
      options: { collapsed: false }
    },
    {
      title: 'Mobile',
      name: 'mobile',
      description: 'Navigation settings for mobile view',
      options: { collapsed: false }
    }
  ],
  fields: [
    {
      title: 'Main Menu',
      name: 'mainMenu',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'desktop'
    },
    {
      title: 'Logo',
      name: 'logo',
      type: 'image',
      description: 'Site Logo (Uncompressed, SVG)'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Header Settings'
      }
    }
  }
}
