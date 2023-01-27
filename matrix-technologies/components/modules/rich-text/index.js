import React from 'react'

import BlockContent from '@components/block-content'

function RichText({ data = {} }) {
  const { content, contentAlignment = 'text-left', anchor } = data

  return (
    <section id={anchor}>
      <div className="container">
        <BlockContent
          className={`rc--rich-text ${contentAlignment}`}
          blocks={content}
        />
      </div>
    </section>
  )
}

export default RichText
