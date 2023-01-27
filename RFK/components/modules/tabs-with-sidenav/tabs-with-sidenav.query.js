import { imageMeta, ptContent } from 'data/utils'
import { gridQuery } from '../grid/grid.query'

export const tabsWithSidenavQuery = `_type == 'tabsWithSidenav' => {
  _type,
  _key,
  tabs[]{
    _type == 'directorTab' => {
      _type, 
      _id, 
      tabTitle,
      tabDescription,
      columns[]{
        staffList[]{
          name, jobTitle
        }
      }
      
    },
    _type == 'executiveTab' => {
      _type, 
      _id, 
      tabTitle,
      staffList[]{
        name, jobTitle, description[]{ ${ptContent} }, photo{
          ${imageMeta}
        }
      }
    },
    _type == 'freeTab' => {
      _type, 
      _id, 
      tabTitle,
      textBlocks[]{
        ${gridQuery}
      }
    }
  },
  title,
  allVisible,
  darkerBg
}`
