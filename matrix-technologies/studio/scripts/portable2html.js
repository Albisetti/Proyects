import sanityClient from 'part:@sanity/base/client'
import axios from 'axios'
import { nanoid } from 'nanoid'

import blocksToHtml from '@sanity/block-content-to-html'

const client = sanityClient.withConfig({ apiVersion: '2021-03-25' })

// `h` is a way to build HTML known as hyperscript
// See https://github.com/hyperhype/hyperscript for more info
const h = blocksToHtml.h

const serializers = {
  types: {
    code: (props) =>
      h('pre', { className: props.node.language }, h('code', props.node.code)),
  },
}

client.fetch('*[_type == "product"]').then(async (products) => {
  const productSelection = [...products]
  while (true) {
    const product = productSelection.pop()
    if (!product) {
      break
    }
    if (product.description) {
      const el = blocksToHtml({
        blocks: product.description,
      })

      const msg = await client
        .patch(product._id)
        .set({ description: el })
        .commit()
    }
  }
})
