import styles from './quiz-checkbox.module.scss'

export default function CommonCheckBox({
  className = '',
  type,
  name,
  checked,
  onChange,
  index,
}) {
  const handleOptionImage = (index) => {
    switch (index) {
      case 0:
        return `url(/images/no-to-delete/checkbox/optionA.svg)`
      case 1:
        return `url(/images/no-to-delete/checkbox/optionB.svg)`
      case 2:
        return `url(/images/no-to-delete/checkbox/optionC.svg)`
      case 3:
        return `url(/images/no-to-delete/checkbox/optionD.svg)`
      case 4:
        return `url(/images/no-to-delete/checkbox/optionE.svg)`
      case 5:
        return `url(/images/no-to-delete/checkbox/optionF.svg)`
      case 6:
        return `url(/images/no-to-delete/checkbox/optionG.svg)`
      case 7:
        return `url(/images/no-to-delete/checkbox/optionH.svg)`
      case 8:
          return `url(/images/no-to-delete/checkbox/optionI.svg)`
      default:
        break
    }
  }

  return (
    <>
      <div className={styles.formGroup}>
        <input
          type="checkbox"
          id={type}
          value={type}
          checked={checked}
          onChange={onChange}
        />
        <label
          htmlFor={type}
          style={{
            backgroundImage: handleOptionImage(index),
            backgroundSize: '0px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></label>
        <span className={styles.label}>{name}</span>
      </div>
    </>
  )
}
