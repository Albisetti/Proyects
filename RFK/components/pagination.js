import { DOTS, usePagination } from '@lib/use-pagination'
import React from 'react'

const Pagination = (props) => {
  const { onPageChange, totalPageCount, siblingCount = 1, currentPage } = props

  const paginationRange = usePagination({
    totalPageCount,
    siblingCount,
    currentPage,
  })

  return (
    <ul
      className={
        'flex items-center justify-center list-none p-0 gap-x-12 lg:gap-x-16'
      }
    >
      {currentPage !== 1 ? (
        <li
          className={`pb-4 mx-4 lg:mx-8 cursor-pointer border-b-2`}
          onClick={() => {
            onPageChange(currentPage - 1)
          }}
        >
          Prev
        </li>
      ) : null}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li key={index} className={'text-center pb-4 border-b-2'}>
              &#8230;
            </li>
          )
        }
        return (
          <li
            key={index}
            className={`text-center pb-4 border-b-2  ${
              currentPage === pageNumber
                ? 'text-blue font-bold'
                : 'cursor-pointer border-b-2 '
            } `}
            onClick={() => {
              onPageChange(pageNumber)
            }}
          >
            {pageNumber}
          </li>
        )
      })}
      {currentPage < totalPageCount ? (
        <li
          className={`pb-4 mx-4 lg:mx-8 cursor-pointer border-b-2`}
          onClick={() => {
            onPageChange(currentPage + 1)
          }}
        >
          Next
        </li>
      ) : null}
    </ul>
  )
}

export default Pagination
