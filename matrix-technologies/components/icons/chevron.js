import React from 'react'

const Chevron = ({ left = false, right = false, style = {}, ...props }) => (
  <svg
    width={30.981}
    height={56.305}
    fill="none"
    viewBox="0 0 30.981 56.305"
    xmlns="http://www.w3.org/2000/svg"
    style={left ? { transform: 'rotateY(180deg)', ...style } : { ...style }}
    {...props}
  >
    <path
      style={{
        stroke: 'currentColor',
        strokeWidth: 4,
      }}
      d="m1.414 1.414 26.739 26.739L1.414 54.89"
    />
  </svg>
)

export default Chevron
