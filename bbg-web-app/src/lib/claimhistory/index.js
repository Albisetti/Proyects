import gql from "graphql-tag";

export const FETCH_CLAIM_PERIOD = gql`
    query {
        distinctReportPeriodForCloseClaims {
            quarter
            year
            report_period
        }
    }
`;

export const FETCH_CLAIM_PER_PERIOD = gql`
    query claimsForReportPeriod(
        $after: String
        $year: Int!
        $quarter: Int!
    ) {
        claimsForReportPeriod(
            first: 200000
            after: $after
            year: $year
            quarter: $quarter
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
                    is_template
                    claim_type
                    name
                    status
                    report_period
                    report_year
                    report_quarter
                    claim_start_date
                    claim_end_date
                    total_payment_rebate
                    report_total
                    totalDisputesCount
                    openDisputesCount
                    updated_at
                    closeDisputesCount
                    calculateCurrentTotal {
                        total
                    }
                    program {
                        id
                        name
                        type
                        company {
                            name
                        }
                    }
                    propertyUnitCount {
                        type
                        count
                    }
                }
            }
        }
    }
`;
