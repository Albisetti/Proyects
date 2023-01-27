const columnData = `{
  title,
  color,
  nodes[]{
    title,
    'icon': icon.asset->url
  }
}`

export const connectedNodesGridQuery = `
_type == 'connectedNodes' => {
  _type,
  _key,
  title,
  bgColor,
  contentGrid{
    firstColumn${columnData},
    secondColumn${columnData},
    thirdColumn${columnData}
  }
}`
