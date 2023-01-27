import React from 'react'
import styled, { css } from 'styled-components'

const Logo = ({ projectName }) => {
  return (
    <Icon isLogin={projectName}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99.75 36.23" fill="#46433a"><defs /><g id="Layer_2" data-name="Layer 2"><g id="Navigation"><path className="cls-1" d="M6.61,14.81c0-.89.66-1.56,2-1.56A2.42,2.42,0,0,1,11,15l5.75-.43c-.67-3.52-3.28-6.18-8.6-6.18C3.32,8.4.43,11.26.43,14.58c0,7.31,10.4,6.18,10.4,8.4,0,.86-.9,1.76-2.43,1.76a2.46,2.46,0,0,1-2.65-2.19L0,23c.66,4,3.32,6.61,8.83,6.61,5.09,0,8.17-3.09,8.17-6.41C17,15.91,6.61,17,6.61,14.81Z" /><path className="cls-1" d="M30,8.64a8.78,8.78,0,0,0-5.75,2.19l-.89-2H19v27.4h6V27.6A8.13,8.13,0,0,0,30,29.39c5.08,0,9.5-4.41,9.5-10.39S35.1,8.64,30,8.64Zm-.9,15.2A4.53,4.53,0,0,1,24.7,19a4.44,4.44,0,1,1,8.84,0C33.54,21.89,31.58,23.84,29.12,23.84Z" /><rect className="cls-1" x="41.47" y="1.33" width="5.98" height="27.83" /><path className="cls-1" d="M53.63,9.91a6.28,6.28,0,0,1-3.09-.84V29.16h6v-20A6.26,6.26,0,0,1,53.63,9.91Z" /><path className="cls-1" d="M68.84,13.92a4.1,4.1,0,0,1,3.75,2.89l6-.47S77,8.4,68.84,8.4A10.44,10.44,0,0,0,58.48,19,10.4,10.4,0,0,0,68.84,29.59c8.16,0,9.73-7.94,9.73-7.94l-6-.43a4.09,4.09,0,0,1-3.75,2.86c-2.43,0-4.42-2-4.42-5.08S66.41,13.92,68.84,13.92Z" /><path className="cls-1" d="M99.75,19c0-6.41-4.41-10.6-10-10.6A10.44,10.44,0,0,0,79.43,19,10.36,10.36,0,0,0,89.59,29.59c5.28,0,8.37-3.09,9.5-6.41l-6.18-.43a3.73,3.73,0,0,1-3.12,1.33A4.34,4.34,0,0,1,85.6,21H99.52A11.52,11.52,0,0,0,99.75,19ZM85.6,17.24a4.32,4.32,0,0,1,8.41,0Z" /><path className="cls-1" d="M53.53,0a3.42,3.42,0,0,0-3.32,3.32,3.32,3.32,0,0,0,6.64,0A3.42,3.42,0,0,0,53.53,0Z" /></g></g></svg>
    </Icon>
  )
}

const Icon = styled.div`
  display: block;
  width: auto;
  height: 2em;
  max-width: 100%;
  margin: -0.75rem auto;
  color: white;

  ${props =>
    props.isLogin &&
    css`
      display: block;
      margin: 0 auto;
      height: 4rem;
      color: black;
    `}

  svg {
    display: block;
    margin: 0 auto;
    height: 100% !important;
    width: auto;
    fill: currentColor;
  }
`

export default Logo
