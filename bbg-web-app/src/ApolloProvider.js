import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from "apollo-link-context";
import App from "./App";
import { relayStylePagination } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
});

const authLink = setContext(() => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    bundles: relayStylePagination(),
                    subcontractors: relayStylePagination(),
                    organizations: relayStylePagination(),
                    programs: relayStylePagination(),
                    subdivisions: relayStylePagination(),
                    claims: relayStylePagination(),
                    users: relayStylePagination(),
                    claimsForReportPeriod: relayStylePagination(),
                    organizationsWithRebate: relayStylePagination(),
                    userNotifications: relayStylePagination(),
                    recentClaimPerProgram:relayStylePagination(),
                },
            },
        },
    }),
});

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
