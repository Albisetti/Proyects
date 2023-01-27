import gql from "graphql-tag";

export const FETCH_BUNDLES_QUERY = gql`
  query bundles($after: String) {
    bundles(first: 20, after: $after orderBy: [{ column: "updated_at", order: DESC }]) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        total
        count
      }
      edges {
        node {
          id
          name
          uniquePrograms
          organization {
            id
            name
          }
          products(first: 2000) {
            edges {
              node {
                id
                name
                minimum_unit
                bbg_product_code
                require_quantity_reporting
                bundlePivot {
                  product_quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const DELETE_BUNDLE = gql`
  mutation deleteBundle($id:ID!) {
    deleteBundle(id:$id) 
  }
`

export const SEARCH_BUNDLES_QUERY = gql`
  query searchBundles($search:String) {
    searchBundles(first: 200,search:$search ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        total
        count
      }
      edges {
        node {
          id
          name
          uniquePrograms
          organization {
            id
            name
          }
          products(first: 2000) {
            edges {
              node {
                id
                name
                minimum_unit
                bbg_product_code
                require_quantity_reporting
                bundlePivot {
                  product_quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_BUNDLE = gql`
  mutation createBundle($name: String, $organization: ID!) {
    createBundle(
      input: { name: $name, organization: { connect: $organization } }
    ) {
      id
      name
      organization {
        id
        name
      }
    }
  }
`;

export const UPDATE_BUNDLE = gql`
  mutation updateBundle(
    $id: ID!
    $name: String
    $organization: ID!
    $products: [BundleProductsSyncInput!]
  ) {
    updateBundle(
      id: $id
      input: {
        name: $name
        organization: { connect: $organization }
        products: { sync: $products }
      }
    ) {
      id
      name
      uniquePrograms
      organization {
        id
        name
      }
      products(first: 2000) {
        edges {
          node {
            id
            name
            product_line
            bundlePivot {
              product_quantity
            }
          }
        }
      }
    }
  }
`;

export const FETCH_PRODUCTS_PER_BUNDLE = gql`
  query bundle($id: ID! $first:Int!) {
    bundle(id: $id) {
      products(first: $first) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          total
          count
          currentPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            name
            product_line
            bbg_product_code
            category {
              id
              name
            }
            minimum_unit
            require_quantity_reporting
            programs(first: 20) {
              edges {
                node {
                  name
                  lot_and_address_requirement
                }
              }
            }
            bundlePivot {
              product_quantity
            }
          }
        }
      }
    }
  }
`;

export const FETCH_PROGRAMS_QUERY = gql`
  query programs($after: String) {
    programs(first: 2000000, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        total
        count
      }
      edges {
        node {
          id
          name
          type
          products(first: 20) {
            edges {
              node {
                id
                name
                product_line
                bbg_product_code
                category {
              id
              name
            }
                programs(first: 20) {
                  edges {
                    node {
                      name
                      lot_and_address_requirement
                    }
                  }
                }
                minimum_unit
                require_quantity_reporting
              }
            }
          }
        }
      }
    }
  }
`;
