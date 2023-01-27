export const getProductQL  = (id)=> JSON.stringify({
  query: `{
    product(id:"gid://shopify/Product/${id}") {
        customProductType
        id
        title
        storefrontId
        giftCardTemplateSuffix
        isGiftCard
        metafields(first: 10){
            edges {
              node {
                key
                id
                value
                type
                description
                legacyResourceId
              }
            }
        }
        collections(first: 5) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
        standardizedProductType {
          productTaxonomyNode {
            name
          }
        }
    }
  }`
})