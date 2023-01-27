import gql from "graphql-tag";

export const CHANGE_REBATES_STATUS = gql`
    mutation changeRebatesStatus($rebate_ids: [ID!], $org_id: ID, $status: RebateReportStatus){
        changeRebatesStatus(rebate_ids: $rebate_ids, org_id: $org_id, status: $status)
    }
`

export const GET_UNAVAILABLE_REBATES = gql`
    query getUnavailableRebates{
        getUnavailableRebates
    }
`