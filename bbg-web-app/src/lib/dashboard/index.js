import gql from "graphql-tag";

export const FETCH_ALERTS = gql`
    query userNotifications($after: String) {
        userNotifications(first: 2000000, after: $after orderBy: [{ column: "created_at", order: DESC }]) {
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
                    message
                    message_action
                    user {
                        id
                    }
                    sent_at
                    read_at
                    related_entity {
                        __typename
                        ... on Organizations {
                            id
                        }
                        ... on Programs {
                            id
                            name
                        }
                        ... on Bundles {
                            id
                            organization {
                                id
                            }
                        }
                        ... on SubDivision {
                            id
                            organization {
                                id
                            }
                        }
                        ... on Disputes {
                            id
                            claim {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const BUILDERS_WITHOUT_BUNDLES = gql`
    query buildersWithoutBundles($after: String) {
        buildersWithoutBundles(first: 20, after: $after) {
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

export const FETCH_ADMIN_REBATE_COUNT = gql`
    query {
        actionNeededRebate {
            rebateCount
             
        }
        readiedRebatesCount {
            rebateCount
             
        }
    }
`;

export const CLAIMS_PER_STATUS = gql`
    query {
        totalInProgressClaims: claimsPerStatus(status: [OPEN], first: 20) {
            pageInfo {
                total
            }
        }
        readyForSubmittalClaims: claimsPerStatus(
            status: [SUBMITTED, DISPUTED, READY]
            first: 20
        ) {
            pageInfo {
                total
            }
        }
        totalSubmittedClaims: claimsPerStatus(
            status: [CLOSE, READYTOCLOSE]
            first: 20
        ) {
            pageInfo {
                total
            }
        }
    }
`;

export const LIFE_TIME_REBATES = gql`
    query {
        lifetimeBBGRebates
    }
`;

export const CLAIM_CHART_REPORT = gql`
    query claimChartReport(
        $year: Int!
        $quarter: Int!
        $territoryManagerIds: [ID]
        $builderIds: [ID]
    ) {
        claimChartReport(
            year: $year
            quarter: $quarter
            territoryManagerIds: $territoryManagerIds
            builderIds: $builderIds
        ) {
            periodCloseClaims {
                volumeTotal
                factoryTotal
                previousResults {
                    year
                    quarter
                    volumeTotal
                    factoryTotal
                }
            }
            yearCloseClaims {
                volumeTotal
                factoryTotal
                contributingPrograms {
                    name
                    id
                    type
                    contributedTotal
                    company {
                        name
                        id
                    }
                }
                previousResults {
                    year
                    quarter
                    volumeTotal
                    factoryTotal
                }
            }
        }
    }
`;

export const GET_CONVERSION_REVENUE = gql`
    query conversionRevenue($year: Int!) {
        conversionRevenue(input: { year: $year }) {
            yearTotal {
                year
                total
            }
            quarterly {
                quarter
                total
            }
        }
    }
`;

export const GET_CONVERSION_DATA = gql`
    query {
        conversionPaymentsPastDue {
            __typename
            ... on ConversionFlatPayment {
                amount
                bonus_amount
                program {
                    name
                    type
                    id
                }
                anticipated_payment_date
                name
            }
            ... on ConversionFlatPercent {
                name
                program {
                    name
                    type
                    id
                }
                bonus_percent
                max_amount
            }
        }

        upcomingConversionPayments {
            ... on ConversionFlatPayment {
                amount
                bonus_amount
                program {
                    name
                    type
                    id
                }
                anticipated_payment_date
                name
            }
            ... on ConversionFlatPercent {
                name
                program {
                    name
                    type
                    id
                }
                bonus_percent
                max_amount
            }
        }
    }
`;
