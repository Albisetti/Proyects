import gql from "graphql-tag";

export const ANALYTICS_ORGANIZATIONS = gql`
    query organizations(
        $after: String
        $organization_type: [OrganizationType]
        $first: Int!
    ) {
        organizations(
            first: $first
            after: $after
            organization_type: $organization_type
            orderBy: { column: "updated_at", order: DESC }
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
                    id
                    name
                }
            }
        }
    }
`;

export const ANALYTICS_PROGRAMS = gql`
    query programs($first: Int!) {
        programs(
            first: $first
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
                    id
                    name
                }
            }
        }
    }
`;

export const ANALYTICS_PRODUCTS = gql`
    query products($first: Int!) {
        products(
            first: $first
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
                    id
                    name
                }
            }
        }
    }
`;

export const ANALYTICS_REPORT_BY_BUILDERS = gql`

    query claimReportByBuilder(
        $builderIds:[ID]
        $programIds:[ID]
        $regionIds:[ID]
        $productIds:[ID]
        $territoryManagerIds:[ID]
    ) {
        claimReportByBuilder(
            builderIds:$builderIds
            programIds:$programIds
            productIds:$productIds
            regionIds:$regionIds
            territoryManagerIds:$territoryManagerIds
        ) {
            id
            name
            openClaimsSum {
                volumeTotal
                factoryTotal
            }
            lastCloseClaim {
                calculateCurrentTotal {
                    total
                }
            }
        }
    }

`;

export const ANALYTICS_REPORT_BY_PROGRAMS = gql`

    query claimReportByProgram(
        $builderIds:[ID]
        $programIds:[ID]
        $regionIds:[ID]
        $productIds:[ID]
        $territoryManagerIds:[ID]
    ) {
        claimReportByProgram(
            builderIds:$builderIds
            programIds:$programIds
            productIds:$productIds
            regionIds:$regionIds
            territoryManagerIds:$territoryManagerIds
        ) {
            id
            name
            type
            company{
                id
                name
            }
            openClaimsSum {
                volumeTotal
                factoryTotal
            }
            lastCloseClaim {
                calculateCurrentTotal {
                    total
                }
            }
        }
    }

`;

export const ANALYTICS_REPORT_BY_PRODUCTS = gql`

    query claimReportByProduct(
        $builderIds:[ID]
        $programIds:[ID]
        $regionIds:[ID]
        $productIds:[ID]
        $territoryManagerIds:[ID]
    ) {
        claimReportByProduct(
            builderIds:$builderIds
            programIds:$programIds
            productIds:$productIds
            regionIds:$regionIds
            territoryManagerIds:$territoryManagerIds
        ) {
            id
            name
            bbg_product_code
            category{
            id
            name
            }
            programs(first:20){
                edges{
                    node{
                        name
                    }
                }
            }
            openClaimsSum {
                volumeTotal
                factoryTotal
            }
            lastCloseClaim {
                calculateCurrentTotal {
                    total
                }
            }
        }
    }
`;

export const ANALYTICS_REPORT_BY_TMS = gql`

    query claimReportByTM(
        $builderIds:[ID]
        $programIds:[ID]
        $regionIds:[ID]
        $productIds:[ID]
        $territoryManagerIds:[ID]
    ) {
        claimReportByTM(
            builderIds:$builderIds
            programIds:$programIds
            productIds:$productIds
            regionIds:$regionIds
            territoryManagerIds:$territoryManagerIds
        ) {
            id
            fullName
            openClaimsSum {
                volumeTotal
                factoryTotal
            }
            lastCloseClaim {
                calculateCurrentTotal {
                    total
                }
            }
        }
    }
`;


export const CLAIM_CHART_REPORT = gql`
    query claimChartReport(
        $year: Int!
        $quarter: Int!
        $territoryManagerIds: [ID]
        $builderIds: [ID]
        $regionIds:[ID]
        $productIds:[ID]
        $programIds:[ID]
    ) {
        claimChartReport(
            year: $year
            quarter: $quarter
            territoryManagerIds: $territoryManagerIds
            builderIds: $builderIds
            programIds:$programIds
            productIds:$productIds
            regionIds:$regionIds
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
            allCloseClaimsTotal {
                total
            }
        }
    }
`;
