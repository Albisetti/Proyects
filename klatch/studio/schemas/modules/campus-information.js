import { Bank } from 'phosphor-react'

export default {
  title: 'Campus Information',
  name: 'campusInformation',
  type: 'object',
  icon: Bank,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      initialValue: 'Klatch Campus'
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'text',
      rows: 2,
      initialValue:
        'Klatch Coffee Roastery \n& Training Lab is an SCA Certified Campus.'
    },
    {
      title: 'Address',
      name: 'address',
      type: 'text',
      rows: 2,
      initialValue: '8767 ONYX AVE., \nRANCHO CUCAMONGA CA 91730'
    },
    {
      title: 'Right Image',
      name: 'rightImage',
      type: 'image'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Campus Information',
        subtitle: 'Roastery & Training Lab'
      }
    }
  }
}
