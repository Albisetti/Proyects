import { MapPin } from 'phosphor-react'

import customImage from '../../../../studio/lib/custom-image'

export default {
    title: 'How To Reach Us',
    name: 'howToReachUs',
    type: 'object',
    icon: MapPin,
    fields: [
        {
            title: 'Block Title',
            name: 'mainTitle',
            type: 'string'
        },
        {
            title: 'Content',
            name: 'content',
            type: 'simplePortableText'
        },
        {
            title: 'Social Links',
            name: 'social',
            type: 'array',
            of: [{ type: 'socialLink' }],
        },
        {
            title: 'Address Title',
            name: 'addressTitle',
            type: 'string',
        },
        {
            title: 'Street',
            name: 'street',
            type: 'string',
        },
        {
            title: 'City',
            name: 'city',
            type: 'string',
        },
        {
            title: 'Phone Number',
            name: 'phoneNumber',
            type: 'string',
        },
    ],
    preview: {
        select: {
            title: 'mainTitle'
        }
    }
}
