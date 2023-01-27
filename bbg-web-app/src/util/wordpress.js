
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { relayStylePagination } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client'


const httpLink = createUploadLink({
  uri: process.env.REACT_APP_CMS_GRAPHQL_ENDPOINT,
});


const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const wordPressClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          bundles:relayStylePagination(),
          subcontractors: relayStylePagination(),
          organizations:relayStylePagination(),
          programs:relayStylePagination(),
          subdivisions:relayStylePagination(),
          claims:relayStylePagination(),
          users:relayStylePagination()
        },
      },
    },
  }),
});


