import gql from "graphql-tag";

export const FETCH_STATES_QUERY = gql`
    query{
  states(first:10000){
    edges{
      node{
        name
        id
      }
    }
  }
}
`