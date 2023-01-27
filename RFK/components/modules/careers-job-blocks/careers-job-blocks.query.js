export const careersJobBlocksQuery = `
_type == 'careersJobBlocks' => {
  _type,
  _key,
  jobBlocks[]{
    title,
    description,
    "image": image.asset->url,
    jobLink
  }
}`
