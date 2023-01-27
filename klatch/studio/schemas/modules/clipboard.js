import { type } from 'os'
import { Clipboard } from 'phosphor-react'

export default {
    title: 'Clipboard',
    name: 'clipboard',
    type: 'object',
    icon: Clipboard,
    fields: [
        {
            title: 'Clipboard',
            name: 'clipboardImageObject',
            type: 'object',
            fields: [
                {
                    title: 'Clipboard Image',
                    name: 'clipboardImage',
                    type: 'image',
                },
                {
                    title: 'Rotation',
                    name: 'rotation',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Left', value: 'left' },
                            { title: 'Right', value: 'right' }
                        ]
                    }
                }
            ]
        },
        {
            title: 'First Overlaying Image',
            name: 'firstOverlayingImage',
            type: 'image',
        },
        {
            title: 'Second Overlaying Image',
            name: 'secondOverlayingImageObject',
            type: 'object',
            fields: [
                {
                    title: 'Image',
                    name: 'secondOverlayingImage',
                    type: 'image'
                },
                {
                    title: 'Is a Polaroid Image?',
                    name: 'isPolaroid',
                    type: 'boolean'
                },
                {
                    title: 'Polaroid Image text',
                    name: 'polaroidText',
                    type: 'string'
                }
            ]
        },
        {
            title: 'Left Image',
            name: 'leftImage',
            type: 'image'
        },
        {
            title: 'Left Polaroid Image',
            name: 'leftPolaroidImage',
            type: 'image'
        },
        {
            title: 'Overlaying Text',
            name: 'overlayingText',
            type: 'complexPortableText'
        }
    ],
    preview: {
        prepare() {
            return {
                title: 'Clipboard',
                subtitle: 'Displays a clipboard with overlaying images and text '
            }
        }
    }
}