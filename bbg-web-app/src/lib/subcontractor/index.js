import gql from "graphql-tag";

export const FETCH_SUBCONTRACTOR_QUERY = gql`
  query subcontractors($after: String) {
    subcontractors(first: 20, after: $after orderBy: { column: UPDATED_AT, order: DESC }) {
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
          organizations(first: 20) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              total
              count
              currentPage
            }
            edges {
              node {
                id
                name
              }
            }
          }
          categories(first:20) {
            edges {
              node {
                id
                name
              }
            }
          }
          company_name
          contact_name
          email
          office_number
          mobile_number
          office_number_ext
          address
          address2
          state {
            id
            name
          }
          zip_postal
          city
          created_by
          updated_by
          created_at
          updated_at
          archived_by
          archived_at
        }
      }
    }
  }
`;

export const SEARCH_SUBCONTRACTOR_QUERY = gql`
  query searchSubcontractors($after: String,$search: String) {
    searchSubcontractors(search:$search,first: 20, after: $after) {
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
          organizations(first: 20) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              total
              count
              currentPage
            }
            edges {
              node {
                id
                name
              }
            }
          }
          categories(first:20) {
            edges {
              node {
                id
                name
              }
            }
          }
          company_name
          contact_name
          email
          office_number
          mobile_number
          office_number_ext
          address
          address2
          state {
            id
            name
          }
          zip_postal
          city
          created_by
          updated_by
          created_at
          updated_at
          archived_by
          archived_at
        }
      }
    }
  }
`;

export const CREATE_SUBCONTRACTOR = gql`
    mutation createSubcontractor(
        $company_name: String!
        $contact_name: String!
        $email: String
        $office_number: String
        $office_number_ext: String
        $mobile_number: String
        $connect: [ID!]
        $categoryConnect: [ID!]
        $city: String!
        $state_id: Int
        $address: String!
        $zip_postal: String
        $address2: String
    ) {
        createSubcontractor(
            input: {
                company_name: $company_name
                contact_name: $contact_name
                email: $email
                office_number: $office_number
                organizations: { connect: $connect }
                categories: { sync: $categoryConnect } #Make sure the existing values are passed in sync.
                office_number_ext: $office_number_ext
                mobile_number: $mobile_number
                state_id: $state_id
                city: $city
                address: $address
                address2: $address2
                zip_postal: $zip_postal
            }
        ) {
            id
            organizations(first: 10) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    total
                    count
                    currentPage
                }
                edges {
                    node {
                        id
                        name
                    }
                }
            }
            categories(first: 20) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
            company_name
            contact_name
            email
            office_number
            mobile_number
            state {
                id
                name
            }
            address
            address2
            city
            zip_postal
            created_at
            updated_at
            created_by
            updated_by
            created_at
            updated_at
            archived_by
            archived_at
        }
    }
`;


export const UPDATE_SUBCONTRACTOR = gql`
    mutation updateSubcontractor(
        $id: ID!
        $company_name: String
        $contact_name: String
        $email: String
        $office_number: String
        $office_number_ext: String
        $mobile_number: String
        $connect: [ID!]
        $sync: [ID!]
        $categoriesSync: [ID!]
        $disconnect: [ID!]
        $city: String!
        $state_id: Int
        $address: String
        $zip_postal: String
        $address2: String
    ) {
        updateSubcontractor(
            id: $id
            input: {
                company_name: $company_name
                contact_name: $contact_name
                email: $email
                office_number: $office_number
                organizations: { connect: $connect, disconnect: $disconnect, sync: $sync }
                categories: { sync: $categoriesSync } #Make sure the existing values are passed to sync. 
                office_number_ext: $office_number_ext
                mobile_number: $mobile_number
                state_id: $state_id
                city: $city
                address: $address
                address2: $address2
                zip_postal: $zip_postal
            }
        ) {
            id
            organizations(first: 10) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    total
                    count
                    currentPage
                }
                edges {
                    node {
                        id
                        name
                    }
                }
            }
            company_name
            contact_name
            email
            office_number
            mobile_number
            state {
                id
                name
            }
            categories(first: 20) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
            address
            address2
            city
            zip_postal
            created_at
            updated_at
            created_by
            updated_by
            created_at
            updated_at
            archived_by
            archived_at
        }
    }
`;


