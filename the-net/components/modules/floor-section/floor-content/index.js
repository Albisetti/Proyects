import { MenuContext } from '@context/menuContext'
import React, { useContext } from 'react'

import styles from './styles.module.scss'

const FloorContent = ({ data = {} }) => {
  const { addMenu } = useContext(MenuContext)
  const { title, subtitle, floorList } = data
  return (
    <div className={styles.floorContentContainer}>
      <h1 className={styles.floorTitle}>{title}</h1>
      <h2 className={styles.floorSubtitle}>{subtitle}</h2>
      <ul className={styles.floorList}>
        {floorList
          ? floorList.map((floor) => {
              return (
                <li key={floor} onClick={() => addMenu(`floor-menu/${floor}`)}>
                  <div className={styles.floorText}>
                    <div className={styles.horizontalLineContainer}>
                      <div className={styles.horizontalLine} />
                    </div>
                    <p>{floor}</p>
                  </div>
                </li>
              )
            })
          : null}
      </ul>
    </div>
  )
}

export default FloorContent
