import gql from "graphql-tag";

export const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                id
                type
                first_name
                last_name
                userImage
                email
                mobile_phone
                managedOrganizations(first: 200000) {
                    edges {
                        node {
                            id
                            organization_type
                            name
                            code
                        }
                    }
                }
                organizations(first: 1) {
                    edges {
                        node {
                            id
                            organization_type
                            isPeriodClosing
                            programs(first: 1000) {
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
                            membershipValue {
                                total
                                programsAllocation {
                                    name
                                    id
                                    type
                                    contributedTotal
                                    company {
                                        id
                                        name
                                    }
                                }
                            }
                            territoryManagers(first: 1) {
                                edges {
                                    node {
                                        id
                                        type
                                        first_name
                                        last_name
                                        userImage
                                        mobile_phone
                                        email
                                    }
                                }
                            }
                            name
                            ActionRequiredRebatesCount {
                                rebateCount
                            }
                            ReadiedRebatesCount {
                                rebateCount
                            }
                            code
                        }
                    }
                }
            }
            error
            message
            token
        }
    }
`;

export const FORGET_PASSWORD = gql`
    mutation forgotPassword($email: String!, $requestingForAnother: Boolean) {
        forgotPassword(email: $email, requestingForAnother: $requestingForAnother) {
            success
            message
        }
    }
`;

export const FULL_WHO_AM_I = gql`
    query {
        whoAmI {
            user {
                topBuilders(top: 5) {
                    id
                    name
                    projectedRevenue {
                        projectedTotal
                    }
                }
                # projectedRevenue {
                #     projectedTotal
                #     programs {
                #         id
                #         name
                #         type
                #         contributedTotal
                #         company {
                #             name
                #             id
                #         }
                #     }
                # }
                managedOrganizationsReadiedRebatesCount {
                    rebateCount
                }
                managedOrganizationsActionRequiredRebatesCount {
                    rebateCount
                }
                managedOrganizations(first: 200000) {
                    edges {
                        node {
                            id
                            organization_type
                            name
                            code
                        }
                    }
                }
                organizations(first: 1) {
                    edges {
                        node {
                            id
                            organization_type
                            isPeriodClosing
                            programs(first: 1000) {
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
                            membershipValue {
                                total
                                programsAllocation {
                                    name
                                    id
                                    type
                                    contributedTotal
                                    company {
                                        id
                                        name
                                    }
                                }
                            }
                            territoryManagers(first: 1) {
                                edges {
                                    node {
                                        id
                                        type
                                        first_name
                                        last_name
                                        userImage
                                        mobile_phone
                                        email
                                    }
                                }
                            }
                            name
                            ActionRequiredRebatesCount {
                                rebateCount
                            }
                            ReadiedRebatesCount {
                                rebateCount
                            }
                            code
                            rebateReports(first: 1) {
                                edges {
                                    node {
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const WHO_AM_I = gql`
    query {
        whoAmI {
            user {
                id
                type
                first_name
                last_name
                userImage
                mobile_phone
                email
                managedOrganizations(first: 200000) {
                    edges {
                        node {
                            id
                            organization_type
                            name
                            code
                        }
                    }
                }
                organizations(first: 1) {
                    edges {
                        node {
                            id
                            organization_type
                            isPeriodClosing
                            programs(first: 1000) {
                                edges {
                                    node {
                                        id
                                        name
                                        type
                                        deleted_at
                                        products(first: 20) {
                                            edges {
                                                node {
                                                    id
                                                    name
                                                    product_line
                                                    bbg_product_code
                                                    deleted_at
                                                    category {
                                                        id
                                                        name
                                                    }
                                                    programs(first: 20) {
                                                        edges {
                                                            node {
                                                                id
                                                                name
                                                                lot_and_address_requirement
                                                                deleted_at
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
                            territoryManagers(first: 1) {
                                edges {
                                    node {
                                        id
                                        type
                                        first_name
                                        last_name
                                        userImage
                                        mobile_phone
                                        email
                                    }
                                }
                            }
                            name
                            code
                            rebateReports(first: 1) {
                                edges {
                                    node {
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            }
            impersonator {
                id
                type
                first_name
                last_name
                organizations(first: 1) {
                    edges {
                        node {
                            id
                            organization_type
                            name
                            code
                            isPeriodClosing
                        }
                    }
                }
            }
        }
    }
`;

export const SEND_USER_INVITE = gql`
    mutation sendUserInvite($id: ID!) {
        sendUserInvite(id: $id) {
            results
            user {
                id
            }
        }
    }
`;
