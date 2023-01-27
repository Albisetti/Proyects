import React from 'react'
import cx from 'classnames'

import BlockContent from '@components/block-content'

const Freeform = ({ data, className }) => {
  const { maxWidth, textAlign, content } = data

  return <BlockContent className={cx(maxWidth, textAlign, className)} blocks={content} />
}

export default Freeform
