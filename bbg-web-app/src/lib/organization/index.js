import gql from "graphql-tag";

export const FETCH_ORGANIZATION_PROGRAMS = gql`
    query fetchOrganizationPrograms($id: ID!, $after: String) {
        organization(id: $id) {
            programs(first: 20, after: $after) {
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
        }
    }
`;


export const FETCH_SINGLE_ORGANIZATION_FOR_BATCH = gql`
    query organization($id: ID!) {
        organization(id: $id) {
            programs(first: 2000) {
                edges {
                    node {
                        products(first: 2000) {
                            edges {
                                node {
                                    id
                                    category {
                                        id
                                        name
                                    }
                                    name
                                    minimum_unit
                                    require_quantity_reporting
                                    bbg_product_code
                                    programs(first: 20) {
                                        edges {
                                            node {
                                                id
                                                name
                                                type
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            getUsedOpenProductList {
                product {
                    id
                    category {
                        id
                        name
                    }
                    name
                    minimum_unit
                    require_quantity_reporting
                    bbg_product_code
                    programs(first: 20) {
                        edges {
                            node {
                                id
                                name
                                type
                            }
                        }
                    }
                }
                claims {
                    id
                    claim_type
                }
            }
        }
    }
`;

export const FETCH_ORGANIZATIONS_QUERY = gql`
    query organizations($after: String, $organization_type:[OrganizationType] $first:Int!) {
        organizations(first: $first, after: $after,organization_type:$organization_type, orderBy: { column: "updated_at", order: DESC }) {
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
                    organization_type
                    address
                    address2
                    city
                    state {
                        id
                        name
                    }
                    zip_postal
                    notes
                    contact_first_name
                    contact_last_name
                    contact_title
                    contact_email
                    contact_office_phone
                    contact_office_phone_ext
                    contact_mobile_phone
                }
            }
        }
    }
`;


export const SEARCH_ORGANIZATIONS_QUERY = gql`
    query searchOrganizations($after: String, $search: String,$organization_type:[OrganizationType]) {
        searchOrganizations(search: $search, first: 2000, after: $after,organization_type:$organization_type) {
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
                    organization_type
                    address
                    address2
                    city
                    zip_postal
                    notes
                    state {
                        id
                        name
                    }
                    contact_first_name
                    contact_last_name
                    contact_title
                    contact_email
                    contact_office_phone
                    contact_office_phone_ext
                    contact_mobile_phone
                }
            }
        }
    }
`;

export const UPDATE_ORGANIZATION = gql`
    mutation updateOrganization(
        $id: ID!
        $name: String
        $organization_type: OrganizationType
        $address: String
        $address2: String
        $city: String
        $zip_postal: String
        $state_id:Int
        $notes: String
        $contact_first_name: String
        $contact_last_name: String
        $contact_title: String
        $contact_email: String
        $contact_office_phone: String
        $contact_office_phone_ext: String
        $contact_mobile_phone: String
    ) {
        updateOrganization(
            id: $id
            input: {
                name: $name
                organization_type: $organization_type
                address: $address
                address2: $address2
                city: $city
                state_id:$state_id
                zip_postal: $zip_postal
                notes: $notes
                contact_first_name: $contact_first_name
                contact_last_name: $contact_last_name
                contact_title: $contact_title
                contact_email: $contact_email
                contact_office_phone: $contact_office_phone
                contact_office_phone_ext: $contact_office_phone_ext
                contact_mobile_phone: $contact_mobile_phone
            }
        ) {
            id
            name
            organization_type
            address
            address2
            city
            zip_postal
            notes
            state {
                id
                name
            }
            contact_first_name
            contact_last_name
            contact_title
            contact_email
            contact_office_phone
            contact_office_phone_ext
            contact_mobile_phone
        }
    }
`;

export const CREATE_ORGANIZATION = gql`
    mutation createOrganization(
        $name: String!
        $organization_type: OrganizationType!
        $address: String
        $address2: String
        $city: String
        $state_id:Int
        $zip_postal: String
        $notes: String
        $contact_first_name: String
        $contact_last_name: String
        $contact_title: String
        $contact_email: String
        $contact_office_phone: String
        $contact_office_phone_ext: String
        $contact_mobile_phone: String
    ) {
        createOrganization(
            input: {
                name: $name
                organization_type: $organization_type
                address: $address
                address2: $address2
                city: $city
                state_id:$state_id
                zip_postal: $zip_postal
                notes: $notes
                contact_first_name: $contact_first_name
                contact_last_name: $contact_last_name
                contact_title: $contact_title
                contact_email: $contact_email
                contact_office_phone: $contact_office_phone
                contact_office_phone_ext: $contact_office_phone_ext
                contact_mobile_phone: $contact_mobile_phone
            }
        ) {
            id
            name
            organization_type
            address
            address2
            city
            zip_postal
            notes
            contact_first_name
            contact_last_name
            contact_title
            contact_email
            contact_office_phone
            contact_office_phone_ext
            contact_mobile_phone
        }
    }
`;

export const FETCH_SUBCONTRACTOR_CATEGORY = gql`
    query subcontractorCategories($first:Int!) {
        subcontractorCategories(first: $first, orderBy: { column: "name", order: ASC }) {
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
                }
            }
        }
    }
`;
