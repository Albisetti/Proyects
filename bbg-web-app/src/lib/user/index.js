import gql from "graphql-tag";

export const userNode = gql`
    fragment userNodeFields on User {
        id
        email
        first_name
        last_name
        title
        userImage
        mobile_phone
        office_phone
        office_phone_ext
        address
        city
        address2
        email_verified_at
        state {
            id
            name
        }
        zip_postal
        organizations(first: 1) {
            edges {
                node {
                    id
                    name
                }
            }
        }
        managedOrganizations(first: 1000) {
            edges {
                node {
                    id
                    name
                }
            }
        }
        managedStates(first: 1000) {
            edges {
                node {
                    id
                    iso_code
                    name
                    country
                }
            }
        }
        role {
            id
            name
            capabilities
        }
    }
`;

export const FETCH_TERRITORY_MANAGERS_QUERY = gql`
    ${userNode}
    query users($after: String) {
        users(
            user_type: [TERRITORY_MANAGER]
            first: 20
            after: $after
            orderBy: [{ column: "updated_at", order: DESC }]
        ) {
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
                    ...userNodeFields
                }
            }
        }
    }
`;

export const FETCH_USER = gql`
    ${userNode}
    query user($id: ID!) {
        user(id: $id) {
            ...userNodeFields
        }
    }
`;

export const SEARCH_TERRITORY_MANAGERS_QUERY = gql`
    ${userNode}
    query searchTerritoryManagers($after: String, $search: String) {
        searchTerritoryManagers(search: $search, first: 20, after: $after) {
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
                    ...userNodeFields
                }
            }
        }
    }
`;

export const CREATE_TERRITORY_MANAGER = gql`
    ${userNode}
    mutation createUser(
        $type: UserType!
        $first_name: String
        $last_name: String
        $title: String
        $email: String
        $address: String
        $address2: String
        $office_phone: String
        $office_phone_ext: String
        $mobile_phone: String
        $require_user_account: Boolean
        $city: String
        $disabled: Boolean
        $state_id: ID
        $zip_postal: String
        $managedStates: UserStatesBelongsToMany
    ) {
        createUser(
            input: {
                type: $type
                first_name: $first_name
                last_name: $last_name
                email: $email
                office_phone_ext: $office_phone_ext
                office_phone: $office_phone
                mobile_phone: $mobile_phone
                address: $address
                title: $title
                address2: $address2
                city: $city
                state_id: $state_id
                managedStates: $managedStates
                disabled: $disabled
                zip_postal: $zip_postal
                require_user_account: $require_user_account
            }
        ) {
            ...userNodeFields
        }
    }
`;

export const UPDATE_TERRITORY_MANAGER = gql`
    ${userNode}
    mutation updateUser(
        $id: ID!
        $type: UserType!
        $first_name: String
        $last_name: String
        $title: String
        $email: String
        $address: String
        $address2: String
        $office_phone: String
        $office_phone_ext: String
        $mobile_phone: String
        $require_user_account: Boolean
        $zip_postal: String
        $city: String
        $disabled: Boolean
        $state_id: ID
        $managedStates: UserStatesBelongsToMany
    ) {
        updateUser(
            id: $id
            input: {
                type: $type
                first_name: $first_name
                last_name: $last_name
                email: $email
                office_phone_ext: $office_phone_ext
                office_phone: $office_phone
                mobile_phone: $mobile_phone
                address: $address
                address2: $address2
                title: $title
                city: $city
                state_id: $state_id
                zip_postal: $zip_postal
                managedStates: $managedStates
                disabled: $disabled
                require_user_account: $require_user_account
            }
        ) {
            ...userNodeFields
        }
    }
`;

export const MASS_UPDATE_TMS = gql`
    mutation massUpdateOrganization($organizations: [UpsertOrganizationRelationInput]) {
        massUpdateOrganization(organizations: $organizations) {
            id
            name
        }
    }
`;

export const DELETE_USER = gql`
    ${userNode}
    mutation deleteUser($id: [ID]!) {
        deleteUser(id: $id) {
            ...userNodeFields
        }
    }
`;

export const DELETE_TERRITORY_MANAGER_PROFILE_IMAGE = gql`
    ${userNode}
    mutation deleteUserImage($id: ID!) {
        deleteUserImage(id: $id) {
            ...userNodeFields
        }
    }
`;

export const USER_PROFILE_UPLOAD = gql`
    ${userNode}
    mutation updateUserImage($id: ID!, $image: [Upload]) {
        updateUserImage(id: $id, image: $image) {
            ...userNodeFields
        }
    }
`;

export const IMPERSONATE = gql`
    ${userNode}
    mutation impersonate($id: ID!) {
        impersonate(id: $id) {
            token
            user {
                ...userNodeFields
                type
            }
            impersonator {
                ...userNodeFields
                type
            }
        }
    }
`;

export const STOP_IMPERSONATING = gql`
    ${userNode}
    mutation stopImpersonating {
        stopImpersonating {
            user {
                ...userNodeFields
                type
            }
            token
        }
    }
`;

export const CONFIRM_ACCOUNT_REQUEST = gql`
    ${userNode}
    mutation confirmAccountRequest($forgotCode: String!, $newPassword: String!) {
        confirmAccountRequest(forgotCode: $forgotCode, newPassword: $newPassword) {
            token
            user {
                ...userNodeFields
                type
            }
        }
    }
`;

export const RESET_PASSWORD_REQUEST = gql`
    ${userNode}
    mutation resetPasswordRequest($forgotCode: String!, $newPassword: String!) {
        resetPasswordRequest(forgotCode: $forgotCode, newPassword: $newPassword) {
            token
            user {
                ...userNodeFields
                type
            }
        }
    }
`;

export const GET_USERS_BY_TYPE = gql`
    ${userNode}
    query getUsersByType($types: [UserType!]!) {
        users(user_type: $types, first: 100000, orderBy: [{ column: "updated_at", order: DESC }]) {
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
                    ...userNodeFields
                    type
                }
            }
        }
    }
`;

export const IS_EMAIL_AVAILABLE = gql`
    mutation isEmailAddressAvailable($email: String!) {
        isEmailAddressAvailable(email: $email) {
            exists
            existing_account_type
        }
    }
`;
