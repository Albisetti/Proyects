import React from 'react'
import cx from 'classnames'

const WaveLines = ({ data = {} }) => {
  const { inverted, invertedScheme, spacing } = data

  return (
    <div className={cx('relative w-full', { 'pt-[100px] h-[180px]': spacing })}>
      <img
        src={
          !inverted
            ? '/waves-top.png'
            : invertedScheme
            ? '/waves-bot-alt.png'
            : '/waves-bot.png'
        }
        alt=""
        className="hidden md:block absolute w-full h-auto translate-y-[-50%] z-[0]"
      />
    </div>
  )
}

export default WaveLines
