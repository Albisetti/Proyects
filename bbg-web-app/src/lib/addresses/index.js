import gql from "graphql-tag";

export const houseNode = gql`
    fragment houseNodeFields on rebateReportThreeWayHouseRelation {
        model {
            id
            address
            address2
            project_number
            lot_number
            model
            confirmed_occupancy
            subdivision {
                name
                id
            }
        }
        pivots {
            id
            status
            product_quantity
            product_brand
            claimed
            isModifiable
            product_serial_number
            product_model_number
            product_date_of_purchase
            product_date_of_installation
            subcontractorProvider {
                id
                company_name
            }
            products {
                id
                name
                minimum_unit
                bbg_product_code
                require_quantity_reporting
                isModifiable
                programs(first: 20) {
                    edges {
                        node {
                            id
                            require_certificate_occupancy
                            require_brand
                            require_serial_number
                            require_model_number
                            require_date_of_installation
                            require_date_of_purchase
                            require_distributor
                            lot_and_address_requirement
                            name
                        }
                    }
                }
                category {
                    id
                    name
                }
            }
            created_by
            updated_by
            created_at
            updated_at
        }
    }
`;

export const CREATE_SUBDIVISION = gql`
    mutation createSubdivision($name: String!, $organization_id: ID) {
        createSubdivision(input: { name: $name, organization: { connect: $organization_id } }) {
            id
            name
            created_by
            updated_by
            created_at
            updated_at
        }
    }
`;

export const DELETE_ADDRESS = gql`
    mutation deleteHouse($id: [ID!]!) {
        deleteHouse(id: $id) {
            id
        }
    }
`;

export const CREATE_SUBDIVISION_AND_CONNECT_HOUSES = gql`
    mutation createSubdivision($name: String!, $organization_id: ID, $houses: [ID]) {
        createSubdivision(
            input: { name: $name, organization: { connect: $organization_id }, houses: { connect: $houses } }
        ) {
            id
            name
            created_by
            updated_by
            created_at
            updated_at
            houses(first: 20) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    total
                    count
                    currentPage
                }
                edges {
                    node {
                        property_type
                        address
                        address2
                        state {
                            id
                            name
                        }
                        city
                        lot_number
                        zip_postal
                        id
                        subdivision {
                            name
                            id
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_UNAVAILABLE_SUBDIVISIONS = gql`
    query unavailableSubdivisions {
        UnavailableSubdivisions
    }
`;

export const FETCH_SUBDIVISIONS = gql`
    query subdivisions($after: String) {
        subdivisions(first: 20, after: $after, orderBy: [{ column: "updated_at", order: DESC }]) {
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
                    created_by
                    updated_by
                    created_at
                    updated_at
                    deleted_at
                    houses(first: 20) {
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                            startCursor
                            total
                            count
                            currentPage
                        }
                        edges {
                            node {
                                property_type
                                address
                                address2
                                state {
                                    id
                                    name
                                }
                                city
                                lot_number
                                zip_postal
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const SEARCH_SUBDIVISIONS = gql`
    query searchSubdivisions($search: String) {
        searchSubdivisions(first: 20, search: $search) {
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
                    created_by
                    updated_by
                    created_at
                    updated_at
                    houses(first: 20) {
                        pageInfo {
                            hasNextPage
                            hasPreviousPage
                            startCursor
                            total
                            count
                            currentPage
                        }
                        edges {
                            node {
                                property_type
                                address
                                address2
                                state {
                                    id
                                    name
                                }
                                city
                                lot_number
                                zip_postal
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_HOUSES_PER_SUBDIVISION = gql`
    query subdivisionWithData($id: ID!) {
        subdivisionWithData(id: $id) {
            data {
                residential_number
                multiUnit_number
                commercial_number
                rebate_inProgress_number
                rebate_rebated_number
            }
            subdivision {
                id
                name
                houses(first: 500) {
                    edges {
                        node {
                            property_type
                            address
                            address2
                            confirmed_occupancy
                            model
                            project_number
                            state {
                                id
                                name
                            }
                            city
                            lot_number
                            zip_postal
                            id
                        }
                    }
                }
            }
        }
    }
`;

export const UPDATE_HOUSE = gql`
    mutation updateHouse(
        $id: ID!
        $state_id: Int
        $address: String
        $address2: String
        $lot_number: String
        $zip_postal: String
        $project_number: String
        $model: String
        $confirmed_occupancy: Date
        $city: String
        $organization: Int
    ) {
        updateHouse(
            id: $id
            input: {
                organization_id: $organization
                state_id: $state_id
                model: $model
                confirmed_occupancy: $confirmed_occupancy
                project_number: $project_number
                expected_completion_date: "2018-05-23 13:43:32"
                status: active
                address: $address
                city: $city
                address2: $address2
                zip_postal: $zip_postal
                lot_number: $lot_number
            }
        ) {
            id
            property_type
            square_footage
            expected_completion_date
            status
            address
            confirmed_occupancy
            model
            project_number
            address2
            zip_postal
            lot_number
            city
            state {
                id
                name
            }
        }
    }
`;

export const CREATE_HOUSES_FROM_CSV = gql`
    mutation createHouseFromCSV(
        $file: Upload!
        $propertyType: PropertyType!
        $subdivisionId: Int!
        $organizationId: ID!
    ) {
        createHouseFromCSV(
            file: $file
            propertyType: $propertyType
            subdivisionId: $subdivisionId
            organizationId: $organizationId
        ) {
            id
            property_type
            square_footage
            expected_completion_date
            status
            confirmed_occupancy
            model
            project_number
            address
            address2
            zip_postal
            lot_number
            city
            state {
                id
                name
            }
        }
    }
`;

export const UPDATE_SUBDIVISION = gql`
    mutation updateSubdivision($id: ID!, $houses: [CreateHouseInput!]) {
        updateSubdivision(id: $id, input: { houses: { create: $houses } }) {
            id
            name
            houses(first: 20) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    total
                    count
                    currentPage
                }
                edges {
                    node {
                        id
                        address
                    }
                }
            }
            created_by
            updated_by
            created_at
            updated_at
        }
    }
`;

export const DELETE_SUBDIVISION = gql`
    mutation deleteSubdivision($id: ID!) {
        DeleteSubdivision(id: $id)
    }
`;

export const DISCONNECT_HOUSES = gql`
    mutation updateSubdivision($id: ID!, $houses: [ID]) {
        updateSubdivision(id: $id, input: { houses: { disconnect: $houses } }) {
            id
            name
            houses(first: 20) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    total
                    count
                    currentPage
                }
                edges {
                    node {
                        id
                        address
                    }
                }
            }
            created_by
            updated_by
            created_at
            updated_at
        }
    }
`;

export const SEARCH_ADDRESSES_QUERY = gql`
    query searchHouses($search: String!) {
        searchHouses(search: $search, first: 200) {
            edges {
                node {
                    id
                    address
                    address2
                    zip_postal
                    lot_number
                    city
                    state {
                        id
                        name
                    }
                    subdivision {
                        name
                        id
                    }
                }
            }
        }
    }
`;

export const GET_REBATE_REPORT_QUERY = gql`
    query {
        whoAmI {
            user {
                organizations(first: 1) {
                    edges {
                        node {
                            id
                            rebateReports(first: 1) {
                                edges {
                                    node {
                                        id
                                        houses(first: 100000) {
                                            edges {
                                                node {
                                                    model {
                                                        id
                                                        address
                                                        address2
                                                        project_number
                                                        lot_number
                                                        model
                                                        confirmed_occupancy
                                                        subdivision {
                                                            name
                                                            id
                                                        }
                                                    }
                                                    pivots {
                                                        id
                                                        product_quantity
                                                        claimed
                                                        isModifiable
                                                        products {
                                                            #product only
                                                            id
                                                            name
                                                            minimum_unit
                                                            bbg_product_code
                                                            isModifiable
                                                            require_quantity_reporting
                                                            programs(first: 20) {
                                                                edges {
                                                                    node {
                                                                        id
                                                                        name
                                                                    }
                                                                }
                                                            }
                                                            category {
                                                                id
                                                                name
                                                            }
                                                        }
                                                        created_by
                                                        updated_by
                                                        created_at
                                                        updated_at
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
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

export const GET_NEW_REPORTDATA = gql`
    query ProductsFromOrganization($orgId: ID!) {
        ProductsFromOrganization(org_id: $orgId) {
            id
            isModifiable
            claimed
            house_id
            rebateReport_id
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
            confirmed_occupancy
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

export const GET_PREPARE_REBATES_DATA = gql`
    ${houseNode}
    query($orgId: ID!) {
        organization(id: $orgId) {
            id
            rebateReports(first: 1) {
                edges {
                    node {
                        id
                        NeedActionHouses(first: 10000) {
                            edges {
                                node {
                                    ...houseNodeFields
                                }
                            }
                        }
                        ReadiedHouses(first: 100000) {
                            edges {
                                node {
                                    ...houseNodeFields
                                }
                            }
                        }
                        CompletedHouses(first: 100000) {
                            edges {
                                node {
                                    ...houseNodeFields
                                }
                            }
                        }
                        houses(first: 100000) {
                            edges {
                                node {
                                    ...houseNodeFields
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const NEW_PREPARE_QUERY = gql`
    query ProductsFromOrganization($orgId: ID!) {
        ProductsFromOrganization(org_id: $orgId) {
            rebateReport_id
            id

            #methods
            claimed
            isModifiable

            #pivot fields
            rebate_status
            product_quantity
            product_brand
            product_serial_number
            product_model_number
            product_date_of_purchase
            product_date_of_installation

            #subcontractorProvider
            subcontractor_id
            company_name

            #house fields
            house_id
            property_type
            project_number
            model
            square_footage
            expected_completion_date
            house_status
            house_address
            house_address2
            house_zip_postal
            lot_number
            house_city
            house_state_id
            purchase_order_id
            confirmed_occupancy
            house_created_at
            house_updated_at
            house_deleted_at
            house_subdivision_id
            subdivision_name
            disputes {
                id
            }
            disputed
            rejected
            rejects {
                id
                reject_note
                original_total_allocation
                original_builder_allocation
                original_note
            }

            ##product_fields
            product_id
            product_quantity
            bbg_product_code
            product_name
            require_quantity_reporting
            minimum_unit
            product_categories_name
            product_categories_id
            product_brand
            product_serial_number
            product_model_number
            product_date_of_installation
            product_date_of_purchase
            subcontractor_id
            ##programs
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
        }
    }
`;

export const CREATE_REBATE_REPORT = gql`
    mutation createRebateReportAndMassAssign(
        $houses: [Int]
        $organization: ID
        $products: [RebateReportInputProductInput]
    ) {
        createRebateReportAndMassAssign(
            input: { organization: { connect: $organization }, houses: $houses, products: $products }
        ) {
            id
        }
    }
`;

export const UPDATE_REBATE_REPORT = gql`
    mutation updateRebateReportAndMassAssign($id: ID!, $houses: [Int], $products: [RebateReportInputProductInput]) {
        updateRebateReportAndMassAssign(id: $id, input: { houses: $houses, products: $products }) {
            refusedChanges {
                house
                product
            }
        }
    }
`;

export const ACTION_REQUIRED_MUTATION = gql`
    mutation prepareRebate(
        $id: ID!
        $ActionRequiredObject: [RebateReportsHousesProductsInput]
        $houseObject: [UpdateHouseInput]
    ) {
        prepareRebate(
            updateReport: { id: $id, input: { houses: { syncWithoutDetaching: $ActionRequiredObject } } }
            updateHouses: $houseObject
        ) {
            rebateReport {
                id
            }
            refusedChanges {
                house_id
                product_id
                reason
            }
        }
    }
`;

export const DELETE_PRODUCT_ADDRESS = gql`
    mutation RemoveProductFromRebateReportHouse($report_id: ID!, $house_id: ID!, $product_ids: [ID!]!) {
        RemoveProductFromRebateReportHouse(
            reportId: $report_id
            input: [{ house_id: $house_id, product_ids: $product_ids }]
        ) {
            id
            name
            houses(first: 100) {
                edges {
                    node {
                        model {
                            id
                        }
                    }
                }
            }
        }
    }
`;

export const GET_INDIVIDUAL_REBATE = gql`
    query IndividualRebate($rebate_id: ID!) {
        IndividualRebate(id: $rebate_id) {
            id
            product_brand
            product_serial_number
            product_model_number
            product_date_of_purchase
            product_date_of_installation

            subcontractorProvider {
                id
                company_name
            }
        }
    }
`;

export const CHANGE_REPORT_STATUS = gql`
    mutation changeRebateReportStatus($rebateReport_id: ID!, $house_id: ID!, $status: RebateReportStatus) {
        changeRebateReportStatus(rebateReport_id: $rebateReport_id, house_id: $house_id, status: $status) {
            errors
            rebateReport {
                id
                houses(first: 20) {
                    edges {
                        node {
                            model {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_ORGANIZATION_WITH_REBATE_COUNT = gql`
    query organizationsWithRebate($status: [RebateReportStatus]) {
        organizationsWithRebate(first: 10000, status: $status) {
            pageInfo {
                total
                count
            }
        }
    }
`;

export const FETCH_ORGANIZATION_WITH_REBATE = gql`
    query organizationsWithRebate($after: String, $status: [RebateReportStatus]) {
        organizationsWithRebate(
            first: 20
            after: $after
            status: $status
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
                    isPeriodClosing
                    organization_type
                }
            }
        }
    }
`;

export const SEARCH_ORGANIZATION_WITH_REBATE = gql`
    query searchOrganizationsWithRebate($status: [RebateReportStatus], $search: String) {
        searchOrganizationsWithRebate(first: 200, search: $search, status: $status) {
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
                    isPeriodClosing
                    organization_type
                }
            }
        }
    }
`;

export const UPDATE_HOUSES = gql`
    mutation updateHouses($houses: [UpdateHouseInput]) {
        updateHouses(houses: $houses) {
            id
        }
    }
`;

export const GET_UNAVAILABLE_REBATES = gql`
    query getUnavailableRebates {
        getUnavailableRebates
    }
`;
