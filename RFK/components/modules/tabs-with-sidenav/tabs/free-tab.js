import Grid from '@components/modules/grid'
import React from 'react'

const FreeTab = ({ tabData }) => {
  const { textBlocks } = tabData
  return (
    <div>
      {textBlocks?.map((gridBlockData, key) => {
        return (
          <Grid
            key={key}
            data={gridBlockData}
            className="block-content-tabs-with-sidenav"
          />
        )
      })}
    </div>
  )
}

export default FreeTab
