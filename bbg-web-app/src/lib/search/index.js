import gql from "graphql-tag";

export const SEARCH_PRODUCTS = gql`
    query searchProducts($search: String!) {
        searchProducts(search: $search, first: 1000) {
            edges {
                node {
                    id
                    name
                    bbg_product_code
                    require_quantity_reporting
                    deleted_at
                    programs(first: 20) {
                        edges {
                            node {
                                id
                                require_certificate_occupancy
                                require_brand
                                require_serial_number
                                require_model_number
                                # require_date_of_installation
                                # require_date_of_purchase
                                require_distributor
                                name
                                deleted_at
                            }
                        }
                    }
                    category {
                        id
                        name
                    }
                    minimum_unit
                }
            }
        }
    }
`;
