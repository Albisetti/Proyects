import React, { useState } from 'react'
import styles from './product-quantity-counter.module.scss'

const ProductQuantityCounter = ({ activeVariant, onChange }) => {
  const [quantity, setQuantity] = useState(1)

  const changeQuantity = (q) => {
    setQuantity(q)
    if (onChange) onChange(q)
  }

  return (
    <div>
      <p className={styles.subtitle}>QUANTITY</p>
      <div className={styles.quantityPickerDiv}>
        {activeVariant?.inStock ? (
          <>
            <div
              className={styles.quantityButton}
              onClick={() => changeQuantity(Math.max(1, quantity - 1))}
            >
              -
            </div>
            <p>{quantity}</p>
            <div
              className={styles.quantityButton}
              onClick={() => changeQuantity(quantity + 1)}
            >
              +
            </div>
          </>
        ) : (
          <p>Out of Stock</p>
        )}
      </div>
    </div>
  )
}

export default ProductQuantityCounter
