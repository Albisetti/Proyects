import blockTools from '@sanity/block-tools';
// Construct our "image meta" GROQ
export const imageMeta = `
  "alt": coalesce(alt, asset->altText),
  asset,
  crop,
  customRatio,
  hotspot,
  "url": asset->url,
  "id": asset->assetId,
  "type": asset->mimeType,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "lqip": asset->metadata.lqip
`

export const convertQLNodeToArray = (array) => {
  let _array = array;
  if (!Array.isArray(array) && array?.edges)  {
    _array = array.edges
  }
  if (!Array.isArray(_array)) return _array
  return _array.map(edge => edge.node )
}

export function convertToBlock(inputValue) {
  //if (isValidHTML(inputValue) || withoutValidation) {
      // sanitize html
      const cleanHtmlString = inputValue;
      // replace single backslash from html since input component escapes them already
      const cleanHtmlStringWithoutBackslash = cleanHtmlString?.replace(/(?<!\\)\\(?!\\)/, '')
      // convert
      const blocks = blockTools.htmlToBlocks(
          inputValue,
          'array'
      )
      return blocks
  //} else {
      //return null
  //}
}
