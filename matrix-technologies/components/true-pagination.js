import { DOTS, useTruePagination } from '@lib/true-pagination'
import React from 'react'

const TruePagination = (props) => {
  const { onPageChange, totalPageCount, siblingCount = 1, currentPage } = props

  const paginationRange = useTruePagination({
    totalPageCount,
    siblingCount,
    currentPage,
  })

  return (
    <ul
      className={
        'flex list-none items-center justify-center gap-x-12 p-0 lg:gap-x-16'
      }
    >
      {currentPage !== 1 && currentPage > 1 ? (
        <li
          className={`mx-4 cursor-pointer border-b-2 pb-4 lg:mx-8`}
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
            <li key={index} className={'border-b-2 pb-4 text-center'}>
              &#8230;
            </li>
          )
        }
        return (
          <li
            key={index}
            className={`border-b-2 pb-4 text-center  ${
              currentPage === pageNumber
                ? 'font-bold text-black'
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
          className={`mx-4 cursor-pointer border-b-2 pb-4 lg:mx-8`}
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

export default TruePagination
