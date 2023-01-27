import React, { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import Link from 'next/link'

import useDebounce from '@lib/use-debounce'

function SearchScreen({ open, onClose }) {
  const inputRef = useRef(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const searchEndpoint = (query) =>
    `/api/meilisearch/search?queryValue=${query}`

  const debouncedSearchTerm = useDebounce(query, 500)

  useEffect(() => {
    if (query.length > 2) {
      fetch(searchEndpoint(query))
        .then((res) => res.json())
        .then((res) => {
          setResults(res?.results)
        })
    } else {
      setResults([])
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    if (!inputRef.current) return
    if (open) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [inputRef.current, open])

  const onChange = useCallback((event) => {
    const query = event.target.value
    setQuery(query)
  }, [])

  return (
    <>
      <div
        className={cx(
          'fixed top-0 left-0 z-[95] h-full w-full bg-black opacity-90 transition-all duration-500',
          { 'invisible !opacity-0': !open }
        )}
      />
      <div
        className={cx(
          'px-lg xxl:container absolute left-0 z-[100] mt-[40px] w-full text-center transition-all duration-500',
          { 'invisible !opacity-0': !open }
        )}
      >
        <input
          ref={inputRef}
          type="text"
          className="h-[50px] w-full border-l-0 border-t-0 border-r-0 border-b-[3px] bg-transparent text-[24px] text-white !ring-0 transition-colors duration-500 placeholder:text-[rgba(255,255,255,0.2)] focus:border-white focus:outline-none"
          placeholder="Search"
          onChange={onChange}
        />
        {!!results.length && (
          <div className="mt-[15px] flex max-h-[44vh] w-full flex-col gap-y-[15px] overflow-auto lg:max-h-[55vh]">
            {!!results.length &&
              results.map((res, idx) => (
                <Link
                  href={`/${
                    res.slug !== 'home'
                      ? res.type === 'POST'
                        ? 'media/' + res.slug
                        : res.slug
                      : ''
                  }`}
                >
                  <h3
                    key={idx}
                    className="hover:bg-darkTeal w-full cursor-pointer bg-white py-[6px] px-[15px] text-left transition-colors duration-500 hover:text-white"
                  >
                    {res.title}
                  </h3>
                </Link>
              ))}
          </div>
        )}
        {!!results.length && (
          <h3 className="mt-[30px] text-white">
            {results.length} result{results.length === 1 ? '' : 's'}
          </h3>
        )}
      </div>
    </>
  )
}

export default SearchScreen
