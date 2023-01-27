import React, { useContext, useState } from 'react'
import LocationContent from '../location-content'
import { MenuContext } from '@context/menuContext'

import styles from './styles.module.scss'
import LocationMapMenu from '../location-map-menu'

const LocationContainer = ({ data = {} }) => {
  const { menus } = useContext(MenuContext)

  const { locationContent } = data
  const { waterfrontSection, mapSettings } = locationContent

  const [waterfront, setWaterfront] = useState(false)

  return (
    <>
      <div className={styles.container} id="elemLocation">
        <div className={styles.content}>
          <LocationContent
            data={locationContent}
            setWaterfront={setWaterfront}
          />
        </div>
      </div>
      <LocationMapMenu
        open={!!menus.find((item) => item === 'location-map')}
        mapSettings={mapSettings}
        waterfrontData={waterfrontSection}
        isWaterfrontMenu={waterfront}
      />
    </>
  )
}

export default LocationContainer
