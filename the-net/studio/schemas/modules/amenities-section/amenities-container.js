import { Armchair } from 'phosphor-react'

export default {
  title: 'AMENITIES - Amenities Container',
  name: 'amenitiesContainer',
  type: 'object',
  icon: Armchair,
  fields: [
    {
      title: 'Amenities Content',
      name: 'amenitiesContent',
      type: 'amenitiesContent'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Amenities Container'
      }
    }
  }
}
