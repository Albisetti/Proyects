import gql from "graphql-tag";

export const GET_CLAIM_PER_STATUS = gql`
    query claimsPerStatus($status: [ClaimStatus], $claim_type: ClaimType) {
        claimsPerStatus(first: 200000, status: $status, claim_type: $claim_type) {
            edges {
                node {
                    id
                    is_template
                    claim_type
                    name
                    status
                    total_manual_set
                    report_period
                    report_year
                    report_quarter
                    total_manual_set
                    claim_start_date
                    claim_end_date
                    total_payment_rebate
                    report_total
                    totalDisputesCount
                    openDisputesCount
                    updated_at
                    closeDisputesCount
                    # calculateCurrentTotal {
                    #     total
                    # }
                    program {
                        id
                        name
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

export const GET_CLAIM_FOR_JUST_TOTAL = gql`
    query claim($id: ID!) {
        claim(id: $id) {
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
            total_manual_set
            calculateCurrentTotal {
                total
            }
            program {
                id
                name
            }
            propertyUnitCount {
                type
                count
            }
        }
    }
`;

export const UPDATE_CLAIM_SUBMIITED = gql`
    mutation updateClaim($id: ID!, $status: ClaimStatus) {
        updateClaim(id: $id, input: { status: $status }) {
            id
            report_quarter
            report_year
        }
    }
`;
