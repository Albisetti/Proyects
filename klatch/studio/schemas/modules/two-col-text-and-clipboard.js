export default {
    title: '2 columns with text and clipboard',
    name: 'twoColTextAndClipboard',
    type: 'object',
    fields: [
        {
            title: 'Heading',
            name: 'heading',
            type: 'string',
        },
        {
            title: 'Text',
            name: 'text',
            type: 'complexPortableText'
        },
        {
            title: 'First Mobile Image',
            name: 'firstMobileImage',
            type: 'image',
        },
        {
            title: 'Second Mobile Image',
            name: 'secondMobileImage',
            type: 'image',
        },
        {
            title: 'Clipboard',
            name: 'clipboard',
            type: 'clipboard'
        }
    ]
}