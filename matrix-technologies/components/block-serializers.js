import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import cx from 'classnames'

import CustomLink from '@components/link'
import RichTextImage from '@components/rich-text-image'

export const blockSerializers = {
  types: {
    block: (props) => {
      const { markDefs, style = 'normal' } = props.node

      // check if our block contains a button
      const hasButton =
        markDefs &&
        markDefs.some((c) => c._type === 'link' && c.isButton === true)

      // build our mock header styles
      if (style === 'h1mock') {
        return (
          <p className={cx('is-h1', { 'has-btn': hasButton })}>
            {props.children}
          </p>
        )
      }

      if (style === 'h2mock') {
        return (
          <p className={cx('is-h2', { 'has-btn': hasButton })}>
            {props.children}
          </p>
        )
      }

      if (style === 'h3mock') {
        return (
          <p className={cx('is-h3', { 'has-btn': hasButton })}>
            {props.children}
          </p>
        )
      }

      if (style === 'h4mock') {
        return (
          <p className={cx('is-h4', { 'has-btn': hasButton })}>
            {props.children}
          </p>
        )
      }

      // go through our remaing, true header styles
      if (/^h\d/.test(style)) {
        return React.createElement(
          style,
          { className: hasButton ? 'has-btn' : null },
          props.children
        )
      }

      // handle all other blocks with the default serializer
      return BlockContent.defaultSerializers.types.block(props)
    },
    // photo: ({ node }) => {
    //   return <Photo photo={node} />
    // },
    portableImage: ({ node }) => {
      return <RichTextImage {...node} />
    },
    horizontalRule: () => <hr />,
    embed: ({ node }) => {
      const { title, code } = node
      const src = code.match(/src="([^"]*)/)[1] // Extract src attribute from embed code.
      return (
        <iframe
          src={src}
          width="100%"
          frameBorder="no"
          allowFullScreen
          style={{ border: 0 }}
          title={title}
          loading="lazy"
          className="aspect-video"
        />
      )
    },
  },
  marks: {
    link: ({ mark, children }) => {
      const { 0: title } = children

      return <CustomLink link={{ ...mark, title }} />
    },
  },
}
