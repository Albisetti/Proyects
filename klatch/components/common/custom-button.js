import cx from 'classnames'

import styles from './custom-button.module.scss'

const CustomButton = ({ title, color = 'blue', className, onClick }) => {
  const buttonColorHandler = () => {
    switch (color) {
      case 'orange':
        return 'bg-orange border-orange hover:border-orange text-white hover:bg-white hover:text-orange'
      case 'green':
        return 'bg-green border-green hover:border-green text-white hover:bg-white hover:text-green'
      case 'pink':
        return 'bg-pink border-pink hover:border-pink text-white hover:bg-white hover:text-pink'
      case 'blue':
        return 'bg-blue border-blue hover:border-blue text-white hover:bg-white hover:text-blue'
      default:
        break
    }
  }

  return (
    <button
      className={cx(
        styles.buttonWrapper,
        { [className]: className ? true : false },
        buttonColorHandler()
      )}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default CustomButton
