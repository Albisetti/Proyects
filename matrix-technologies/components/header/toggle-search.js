import React from 'react'
import cx from 'classnames'

import { useToggleSearch } from '@lib/context'

const ToggleSearch = ({ className }) => {
  const toggleSearch = useToggleSearch()

  return (
    <button
      className={cx('btn-text btn-text--menu btn-text--sm', className)}
      onClick={() => toggleSearch()}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={31.984} height={31.984}>
        <defs>
          <clipPath id="a">
            <path
              data-name="Rect\xE1ngulo 14"
              fill={className == 'message' ? '#ffffff' : '#0971ce'}
              d="M0 0h31.984v31.984H0z"
            />
          </clipPath>
        </defs>
        <g data-name="Grupo 1" clipPath="url(#a)">
          <path
            data-name="Trazado 6"
            d="M0 12.341a12.334 12.334 0 0 0 20.17 9.532l9.759 9.76a1.202 1.202 0 1 0 1.7-1.7l-9.757-9.763A12.338 12.338 0 1 0 0 12.341m23.076 0A10.736 10.736 0 1 1 12.341 1.6a10.748 10.748 0 0 1 10.735 10.741"
            fill={className == 'message' ? '#ffffff' : '#0971ce'}
          />
        </g>
      </svg>
    </button>
  )
}

export default ToggleSearch
