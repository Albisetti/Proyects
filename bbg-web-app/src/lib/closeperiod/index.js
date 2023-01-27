import gql from "graphql-tag";

export const FETCH_CLOSE_PERIOD_BUILDERS = gql`
    query {
        buildersWithClaimsDuringOldestUnclosedReportPeriod {
            year
            quarter
            report_period
            uncloseBuilders {
                id
                name
                isPeriodClosing
            }
            closeBuilders {
                builder {
                    name
                    id
                    isPeriodClosing
                }
            }
        }
    }
`;

export const FETCH_ORGANIZATION_DUE = gql`
    query organization($id: ID!, $year: Int, $quarter: Int) {
        organization(id: $id) {
            member_tier
            isPeriodClosing
            annualDue(year: $year) {
                id
                dueLeft
                prorated_amount
                annual_dues
                totalPayed
                dueLeftQuarter(quarter: $quarter, year: $year)
                totalPayedQuarter(quarter: $quarter, year: $year)
            }
            calculateClaimTotal(quarter: $quarter, year: $year) {
                factoryRebate
                volumeRebate
                duePayment
                total
            }
        }
    }
`;


export const CREATE_DUE_PAYMENT = gql`
    mutation createOrganizationDuePayment($amount: Float, $id: ID, $payment_quarter: Int, $payment_year: Int) {
        createOrganizationDuePayment(
            input: { amount: $amount, 
                     payment_quarter: $payment_quarter,
                     payment_year: $payment_year
                     due: { connect: $id } 
                     }
        ) {
            id
            amount
            payment_quarter
            payment_year
            payment_time
            created_by
            updated_by
            created_at
            updated_at
        }
    }
`;


export const APPROVE_READY_TO_CLOSE_CLAIMS = gql`
    mutation approveReadyToCloseClaims(
        $quarter: Int!
        $org_id: ID!
        $year: Int!
        $paid: Float!
        $owed: Float!
        $note: String
    ) {
        approveReadyToCloseClaims(
            quarter: $quarter
            year: $year
            org_id: $org_id
            paid: $paid
            owed: $owed
            note: $note
        )
    }
`;



export const CLOSE_PERIOD = gql`
    mutation closeClaimPeriod(
        $quarter: Int!
        $year: Int!
    ) {
        closeClaimPeriod(
            quarter: $quarter
            year: $year
        ) {
            id
        }
    }
`;


