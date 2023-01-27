import React from 'react'

const DoubleChevron = ({
  left = false,
  right = false,
  style = {},
  ...props
}) => (
  <svg
    width={27.743}
    height={27.828}
    fill="none"
    viewBox="0 0 27.743 27.828"
    xmlns="http://www.w3.org/2000/svg"
    style={left ? { transform: 'rotateY(180deg)', ...style } : { ...style }}
    {...props}
  >
    <path
      d="m1.414 1.414 12.5 12.5-12.5 12.5"
      style={{
        stroke: 'currentColor',
        strokeWidth: 4,
      }}
    />
    <path
      d="m12.414 1.414 12.5 12.5-12.5 12.5"
      style={{
        stroke: 'currentColor',
        strokeWidth: 4,
      }}
    />
  </svg>
)

export default DoubleChevron
