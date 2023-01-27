import React from 'react'
import styles from './products-list.module.scss'



const ProductList = ({products}) => {
  
  console.log(products?.filter((item) => item?.photos?.listing?.length > 0))

  return (
   <div>
     fefefsef
   </div>
  )
}

export default ProductList
