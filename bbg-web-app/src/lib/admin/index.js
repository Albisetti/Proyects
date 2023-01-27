import gql from "graphql-tag";

export const FETCH_USERS_QUERY = gql`
    query users($after: String) {
        users(first: 20, after: $after, user_type: [ADMIN, EXECUTIVE]) {
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
                    email
                    first_name
                    last_name
                    title
                    mobile_phone
                    office_phone
                    email_verified_at
                    office_phone_ext
                    type
                    role {
                        id
                        name
                        capabilities
                    }
                }
            }
        }
    }
`;

export const FETCH_EACH_USER = gql`
    query user($id: ID) {
        user(id: $id) {
            id
            email
            first_name
            last_name
            title
            mobile_phone
            office_phone
            email_verified_at
            office_phone_ext
            type
            role {
                id
                name
                capabilities
            }
        }
    }
`;

export const SEARCH_ADMINS = gql`
    query searchAdministrators($search: String) {
        searchAdministrators(search: $search, first: 200) {
            pageInfo {
                total
                count
                currentPage
            }
            edges {
                node {
                    id
                    email
                    first_name
                    last_name
                    title
                    type
                    email_verified_at
                    mobile_phone
                    office_phone
                    office_phone_ext
                    role {
                        id
                        name
                        capabilities
                    }
                }
            }
        }
    }
`;

export const CREATE_ADMIN = gql`
    mutation createUser(
        $email: String!
        $first_name: String!
        $last_name: String!
        $office_phone: String
        $office_phone_ext: String
        $mobile_phone: String
        $title: String
        $type:UserType
    ) {
        createUser(
            input: {
                first_name: $first_name
                last_name: $last_name
                email: $email
                title: $title
                office_phone: $office_phone
                office_phone_ext: $office_phone_ext
                mobile_phone: $mobile_phone
                type:$type
            }
        ) {
            id
            email
            first_name
            last_name
            title
            email_verified_at
            type
            mobile_phone
            office_phone
            office_phone_ext
        }
    }
`;

export const UPDATE_ADMIN = gql`
    mutation updateUser(
        $email: String
        $id: ID!
        $first_name: String
        $last_name: String
        $office_phone: String
        $office_phone_ext: String
        $mobile_phone: String
        $title: String
        $type:UserType
    ) {
        updateUser(
            id: $id
            input: {
                first_name: $first_name
                last_name: $last_name
                email: $email
                title: $title
                type:$type
                office_phone: $office_phone
                office_phone_ext: $office_phone_ext
                mobile_phone: $mobile_phone
            }
        ) {
            id
            email
            first_name
            last_name
            title
            type
            email_verified_at
            mobile_phone
            office_phone
            office_phone_ext
        }
    }
`;
