import cx from 'classnames'
import React from 'react'

const Button = ({ type, text, style = 'blue', url, target = '_self' }) => {
  return (
    <button type={type} href={url ? url : undefined} target={target}>
      <div className="group flex max-w-min cursor-pointer">
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
    </button>
  )
}

export default Button
