import React from 'react'
import cx from 'classnames'
import styles from './product-option.module.scss'

import ProductSizeBagImage from './product-option-size-bag'

const ProductOption = ({
  option,
  variants,
  activeVariant,
  onChange,
  optionClassName,
  isDropdown,
}) => {
  if (!option?.name) return null

  const variantOptionValue = activeVariant?.options.find(
    (opt) => opt.name === option.name
  )?.value

  if (option.name === 'Size') {
    return (
      <div>
        <p className={styles.subtitle}>SIZE</p>
        <div className={cx(optionClassName, styles.sizeOptionsDiv)}>
          {option?.values?.map((sizeOpt, idx) => (
            <div
              key={idx}
              className={styles.sizeOptionContainer}
              onClick={() =>
                changeOption(
                  option.name,
                  sizeOpt,
                  variants,
                  activeVariant,
                  onChange
                )
              }
            >
              <ProductSizeBagImage
                size={sizeOpt}
                filled={variantOptionValue === sizeOpt}
              />
              <p>{sizeOpt}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (option.name.includes('One-Time') || option.name.includes('Frequency')) {
    return (
      <div>
        <p className={styles.subtitle}>FREQUENCY</p>
        {!isDropdown ? (
          <div className={cx(optionClassName, styles.frequencyDiv)}>
            {option?.values?.map((freqOpt, idx) => {
              const freqOptSplit = freqOpt.split('(')
              const freqOptDiscountText =
                freqOptSplit.length > 1 ? '(' + freqOptSplit[1] : null

              return (
                <div
                  key={idx}
                  className={cx(styles.frequencyBlock, {
                    [styles.selected]: variantOptionValue === freqOpt,
                  })}
                  onClick={() =>
                    changeOption(
                      option.name,
                      freqOpt,
                      variants,
                      activeVariant,
                      onChange
                    )
                  }
                >
                  <p
                    className={cx({
                      [styles.selected]: variantOptionValue === freqOpt,
                    })}
                  >
                    {freqOptSplit[0]}
                  </p>
                  {freqOptDiscountText && (
                    <p
                      className={cx(styles.saveValue, {
                        [styles.selected]: variantOptionValue === freqOpt,
                      })}
                    >
                      {freqOptDiscountText}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <select
            name="frequencyOption"
            className={cx(optionClassName, styles.optionSelect)}
            onChange={(e) =>
              changeOption(
                option.name,
                e.target.value,
                variants,
                activeVariant,
                onChange
              )
            }
          >
            {option?.values?.map((freqOpt, idx) => (
              <option key={idx} value={freqOpt}>
                {freqOpt}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }

  if (option.name.includes('Grind')) {
    return (
      <div className={optionClassName}>
        <p className={styles.subtitle}>GRIND</p>
        <select
          name="grindOption"
          className={styles.optionSelect}
          onChange={(e) =>
            changeOption(
              option.name,
              e.target.value,
              variants,
              activeVariant,
              onChange
            )
          }
        >
          {option?.values?.map((grindOpt, idx) => (
            <option key={idx} value={grindOpt}>
              {grindOpt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (option.name.includes('Days')) {
    return (
      <div>
        <p className={styles.subtitle}>DAYS</p>
        <select
          name="daysOption"
          className={styles.optionSelect}
          onChange={(e) =>
            changeOption(
              option.name,
              e.target.value,
              variants,
              activeVariant,
              onChange
            )
          }
        >
          {option?.values?.map((daysOpt, idx) => (
            <option key={idx} value={daysOpt}>
              {daysOpt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return null
}

// handle option changes
const changeOption = (name, value, variants, activeVariant, changeCallback) => {
  const newOptions = {}
  activeVariant.options.forEach((opt) =>
    opt.name === name
      ? (newOptions[opt.name] = value)
      : (newOptions[opt.name] = opt.value)
  )

  const newVariant = variants.find((variant) =>
    variant.options.every(
      (opt) => opt.name in newOptions && newOptions[opt.name] === opt.value
    )
  )

  if (newVariant && changeCallback) {
    changeCallback(newVariant.id)
  }
}

export default ProductOption
