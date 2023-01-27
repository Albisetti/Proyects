import { useAddItem, useSiteContext } from '@lib/context'
import cx from 'classnames'
import styles from './product-add.module.scss'

const ProductAdd = ({
  product,
  activeVariant,
  quantity = 1,
  customText = '',
  showCustomTextNoStock = false,
  fixedOnMobile = false,
}) => {
  const addItemToCart = useAddItem()
  const { shopifyClient, isLoading, isAdding } = useSiteContext()

  if (!shopifyClient) {
    return (
      <button className={styles.cartButton} disabled>
        Unavailable
      </button>
    )
  }
  if (!product) return null
  const price = activeVariant ? activeVariant.price : product.price
  const comparePrice = activeVariant
    ? activeVariant.comparePrice
    : product.comparePrice

  return (
    <button
      className={cx(styles.cartButton, {
        [styles.cartButtonMobileFixed]: fixedOnMobile,
      })}
      disabled={isLoading || !activeVariant?.inStock}
      onClick={() => addItemToCart(product.id, quantity)}
    >
      <p>
        {isLoading
          ? 'Loading...'
          : activeVariant?.inStock
          ? isAdding
            ? 'Adding...'
            : `${customText || 'ADD TO CART'} $${(price / 100).toFixed(2)}${
                comparePrice
                  ? ` ${Math.ceil(
                      ((comparePrice - price) / comparePrice) * 100
                    )}% off`
                  : ''
              }`
          : `${
              !!customText && showCustomTextNoStock ? customText + ' - ' : ''
            }Out of Stock`}
      </p>
    </button>
  )
}

export default ProductAdd
