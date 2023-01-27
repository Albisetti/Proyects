import { MapPin } from 'phosphor-react'

export default {
  title: 'LOCATION - Location Container',
  name: 'locationContainer',
  type: 'object',
  icon: MapPin,
  fields: [
    {
      title: 'Location Content',
      name: 'locationContent',
      type: 'locationContent'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Location Container'
      }
    }
  }
}
