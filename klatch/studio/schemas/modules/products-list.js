import { List } from 'phosphor-react'

export default {
  title: 'Product List',
  name: 'productsList',
  type: 'object',
  icon: List,
  fields: [
    {
      title: 'Display Product List?',
      name: 'active',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Product List',
        subtitle: "Displays the products with filters"
      }
    }
  }
}
