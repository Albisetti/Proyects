import React from 'react'

const PlayButton = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1000 1000"
    {...props}
  >
    <path
      style={{
        fill: '#fff',
      }}
      d="M500 990C229.4 990 10 770.6 10 500S229.4 10 500 10s490 219.4 490 490-219.4 490-490 490Zm0-891C265.4 99 99.1 265.4 99.1 500c0 234.5 166.3 400.9 400.9 400.9 234.5 0 400.9-166.4 400.9-400.9 0-234.6-166.4-401-400.9-401ZM366.4 277.2 722.7 500 366.4 722.7V277.2z"
    />
  </svg>
)

export default PlayButton
