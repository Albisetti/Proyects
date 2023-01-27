import { useMemo } from 'react'

export const DOTS = '...'

const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export const useTruePagination = ({
  totalPageCount,
  siblingCount = 1,
  currentPage,
}) => {
  const paginationRange = useMemo(() => {
    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5
    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)

    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    )
    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex <= totalPageCount - 2
    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 4
      let leftRange = range(currentPage === 2 ? 2 : 1, leftItemCount) //Ternary operator because on the second page, we don't want to display 1

      return [...leftRange, DOTS, totalPageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 4
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      )
      return [firstPageIndex, DOTS, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [
        firstPageIndex,
        currentPage - 1 > 3 ? DOTS : currentPage - 2, //Display page instead of Dots if page difference is < 3
        ...middleRange,
        totalPageCount - currentPage > 3 ? DOTS : currentPage + 2, //Display page instead of Dots if page difference is < 3
        lastPageIndex,
      ]
    }
  }, [totalPageCount, siblingCount, currentPage])
  return paginationRange
}
