import React from 'react'

const ChevronSmall = ({
  left = false,
  right = false,
  style = {},
  ...props
}) => (
  <svg
    width={16.743}
    height={27.828}
    fill="none"
    viewBox="0 0 16.743 27.828"
    xmlns="http://www.w3.org/2000/svg"
    style={left ? { transform: 'rotateY(180deg)', ...style } : { ...style }}
    {...props}
  >
    <path
      style={{
        stroke: 'currentColor',
        strokeWidth: 4,
      }}
      d="m1.414 1.414 12.5 12.5-12.5 12.5"
    />
  </svg>
)

export default ChevronSmall
