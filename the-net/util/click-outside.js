import { useEffect } from 'react'

export const useClickOutside = function (ref, callback) {
  const onClick = (ev) => {
    if (ref.current && !ref.current.contains(ev.target)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [])
}
