export const isMenuItemActive = (path, slug, isHome) => {
  if (path === '/' && isHome) return true

  let pathParts = path.split('/')
  pathParts = pathParts.map((p) => p.split('?'))
  return pathParts.flat().includes(slug)
}
