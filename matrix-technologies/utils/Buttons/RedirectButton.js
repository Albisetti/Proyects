import cx from 'classnames'
import React from 'react'

const RedirectButton = ({ text, style = 'blue', url, target = '_self' }) => {
  return (
    <a href={url ? url : undefined} target={target}>
      <div className="flex">
        <div
          className={cx(
            'btn-colored',
            style == 'blue' && 'btn-blue',
            style == 'white' && 'btn-white'
            // style == 'blueSmall' && 'btn-blue-small',
            // style == 'whiteSmall' && 'btn-white-small'
          )}
        >
          {text}
        </div>
        <div
          className={cx(
            style == 'blue' && 'blue-lines',
            style == 'white' && 'white-lines'
          )}
        ></div>
      </div>
    </a>
  )
}

export default RedirectButton
