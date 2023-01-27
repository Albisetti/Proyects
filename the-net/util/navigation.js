export const isMenuItemActive = (path, slug) => {
  const pathParts = path.split('/')
  return pathParts.includes(slug)
}

export const hasActiveDropdownItem = (path, item) => {
  if (!item.dropdownItems) return false

  const found = item.dropdownItems.find((dropdownItem) =>
    isMenuItemActive(path, dropdownItem?.slug)
  )
  return found ? true : false
}
