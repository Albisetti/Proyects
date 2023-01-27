import gql from "graphql-tag";

export const MASS_ASSIGN_PROOF_POINTS = gql`
    mutation massAssignProofPoints(
        $rebates: [ID]
        $product_serial_number: String
        $product_model_number: String
        $product_brand: String
        $product_date_of_purchase: DateTimeUtc
        $product_date_of_installation: DateTimeUtc
        $subcontractor: ID
    ) {
        massAssignProofPoints(
            rebates: $rebates
            product_serial_number: $product_serial_number
            product_model_number: $product_model_number
            product_brand: $product_brand
            product_date_of_purchase: $product_date_of_purchase
            product_date_of_installation: $product_date_of_installation
            subcontractor: $subcontractor
        )
    }
`;

export const GET_NEW_REPORTDATA = gql`
    query ProductsFromOrganization($orgId: ID!) {
        ProductsFromOrganization(org_id: $orgId) {
            id
            isModifiable
            claimed
            house_id
            rebateReport_id
            rebate_status
            house_city
            house_address
            house_subdivision_id
            house_address2
            house_zip_postal
            lot_number
            product_id
            product_quantity
            bbg_product_code
            product_name
            require_quantity_reporting
            minimum_unit
            product_categories_name
            product_brand
            product_serial_number
            product_model_number
            product_date_of_installation
            product_date_of_purchase
            subcontractor_id
            company_name

            programs {
                program_id
                program_name
                program_internal_description
                program_builder_description
                program_builder_description_short
                lot_and_address_requirement
                require_certificate_occupancy
                require_brand
                require_serial_number
                require_model_number
                require_date_of_installation
                require_date_of_purchase
                require_distributor
            }

            # products {
            #     id
            #     name
            #     minimum_unit
            #     bbg_product_code
            #     require_quantity_reporting
            #     programs(first: 20) {
            #         edges {
            #             node {
            #                 id
            #                 name
            #             }
            #         }
            #     }
            #     category {
            #         id
            #         name
            #     }
            # }
        }
        disputes(first: 10) {
            edges {
                node {
                    id
                }
            }
        }
        activeSubdivisions(first: 10000) {
            edges {
                node {
                    id
                    name
                    houses(first: 10000) {
                        edges {
                            node {
                                id
                                address
                                address2
                                zip_postal
                                project_number
                                model
                                lot_number
                                city
                                state {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
