import React from 'react'

const SearchIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={20.25}
    width={19.779}
    fill="none"
    viewBox="0 0 19.779 20.25"
    {...props}
  >
    <circle
      style={{
        stroke: 'currentColor',
        strokeWidth: 2,
      }}
      transform="rotate(-45)"
      r={7}
      cy={11.305}
    />
    <path
      style={{
        stroke: 'currentColor',
        strokeWidth: 2,
      }}
      d="m12.472 12.943 6.6 6.6"
    />
  </svg>
)

export default SearchIcon
