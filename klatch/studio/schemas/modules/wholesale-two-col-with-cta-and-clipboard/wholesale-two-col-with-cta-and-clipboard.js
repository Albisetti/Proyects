export default {
    title: 'Wholesale Two Columns with a CTA and Clipboard.',
    name: 'wholesaleTwoColWithCtaAndClipboard',
    type: 'object',
    fields: [
        {
            title: 'Text on the left',
            name: 'textLeft',
            type: 'complexPortableText',
        },
        {
            title: 'Subtitle',
            name: 'subtitle',
            type: 'complexPortableText',
        },
        {
            title: 'CTA',
            name: 'ctaButton',
            type: 'cta'
        },
        {
            title: 'Clipboard',
            name: 'clipboard',
            type: 'clipboard'
        }
    ],
    preview: {
        prepare() {
            return {
                title: 'Wholesale 2 columns with a CTA and a Clipboard',
            }
        }
    }
}