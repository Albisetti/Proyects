import gql from "graphql-tag";

export const FETCH_CLAIM = gql`
    query claim($id: ID, $orgId: ID) {
        claim(id: $id) {
            id
            is_template
            claim_type
            overwrite_note
            name
            status
            report_period
            report_year
            report_quarter
            claim_start_date
            claim_end_date
            total_payment_rebate
            report_total
            total_manual_set
            totalDisputesCount
            openDisputesCount
            updated_at
            closeDisputesCount
            program {
                id
                name
                type
            }
            calculateCurrentTotal {
                total
                builderTotals {
                    builder_id
                    name
                    builder_allocation
                    total
                    disputed
                    disputesId
                    rebatesId
                    builder_tier
                    note
                    rebate_earned
                    rebate_adjusted
                    factory_overwrite {
                        id
                        builder_id
                        note
                        overwrite
                        total_allocation
                        builder_allocation
                    }
                }
            }
            houseProductsForBuilder(orgId: $orgId, first: 100) {
                edges {
                    node {
                        id
                        disputed
                        product_quantity
                        rebateReports {
                            organization {
                                territoryManagers(first: 1) {
                                    edges {
                                        node {
                                            first_name
                                            last_name
                                        }
                                    }
                                }
                            }
                        }
                        houses {
                            id
                            lot_number
                            address
                            address2
                            project_number
                            model
                        }
                        products {
                            programs(first: 20) {
                                edges {
                                    node {
                                        id
                                        name
                                    }
                                }
                            }
                            require_quantity_reporting
                            bbg_product_code
                            category {
                                id
                                name
                            }
                            rebateReportPivot {
                                product_quantity
                            }
                            name
                            id
                        }
                        dispute {
                            id
                            note
                            new_product_quantity
                        }
                    }
                }
            }
        }
    }
`;

export const REJECT_REBATES = gql`
    mutation rejectRebates($rebates: [rejectRebateInput]!) {
        rejectRebates(rebates: $rebates)
    }
`;
