import gql from "graphql-tag";

// $global_product_rebate_amount_type: rebate_amount_type   NO |IDEA

export const programNode = gql`
    fragment ProgramNodeFields on Programs {
        id
        name
        type
        bbg_rebate_unit
        is_flat_rebate
        flat_builder_rebate
        flat_bbg_rebate
        company {
            id
            name
        }
        regions(first: 200) {
            edges {
                node {
                    id
                    name
                }
            }
        }
        start_date
        end_date
        all_builder_report_quantity
        bbg_rebate_unit
        lot_and_address_requirement
        internal_description
        global_bbg_rebate_type
        builder_description
        builder_description_short
        learn_more_url
        require_certificate_occupancy
        available_specific_member_only
        valid_region_type
        product_minimum_unit_requirement
        global_product_minimum_unit
        global_product_rebate_amount_type
        global_product_multi_unit_rebate_amount
        global_product_commercial_rebate_amount
        global_product_residential_rebate_amount
        global_bbg_rebate_type
        require_certificate_occupancy
        require_brand
        require_serial_number
        require_distributor
        require_model_number
        require_date_of_installation
        require_date_of_purchase
        volume_bbg_rebate
        conversionByActivity(first: 100) {
            edges {
                node {
                    id
                    name
                    program {
                        id
                    }
                    measure_unit
                    trigger_amount
                    bonus_amount
                    bonus_name
                    commercial_bonus_amount
                    multi_unit_bonus_amount
                    residential_bonus_amount
                    bonus_type
                    product_included
                    products(first: 20) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                    updated_at
                }
            }
        }
        conversionFlatPercent(first: 100) {
            edges {
                node {
                    id
                    name
                    max_amount
                    bonus_percent
                    payment(first: 100) {
                        edges {
                            node {
                                id
                                amount
                                payment_date
                                note
                            }
                        }
                    }
                    spend_time_range
                    updated_at
                    clock_start
                    anticipated_payment_date
                }
            }
        }
        conversionTieredPercent(first: 100) {
            edges {
                node {
                    id
                    name
                    anticipated_payment_date
                    max_amount
                    valid_period
                    clock_start
                    updated_at
                    tiers(first: 100) {
                        edges {
                            node {
                                bonus_amount
                                spend_exceed
                                id
                                note
                            }
                        }
                    }
                }
            }
        }
        conversionFlatPayment(first: 100) {
            edges {
                node {
                    id
                    name
                    amount
                    updated_at
                    payment(first: 100) {
                        edges {
                            node {
                                id
                                amount
                                payment_date
                                note
                            }
                        }
                    }
                    anticipated_payment_date
                }
            }
        }
        products(first: 1000) {
            edges {
                node {
                    id
                    category {
                        id
                        name
                    }
                    organizationOverwrites(first: 200) {
                        edges {
                            node {
                                name
                                id
                                customProductsPivot {
                                    program_id
                                    volume_bbg_rebate
                                }
                            }
                        }
                    }
                    programs(first: 20) {
                        edges {
                            node {
                                name
                                id
                            }
                        }
                    }
                    bbg_product_code
                    name
                    description
                    minimum_unit
                    require_quantity_reporting
                    product_line
                    created_at
                    updated_at
                    deleted_at
                    programPivot {
                        claimTemplateExist
                        volume_bbg_rebate
                        residential_rebate_amount
                        multi_unit_rebate_amount
                        commercial_rebate_amount
                    }
                    pricings(first: 10000) {
                        edges {
                            node {
                                residential_rebate_amount
                                multi_unit_rebate_amount
                                commercial_rebate_amount
                                flat_bbg_rebate
                                flat_builder_rebate
                                volume_bbg_rebate
                            }
                        }
                    }
                    pivotPricings(relationModel: ORGANIZATION, first: 10000) {
                        edges {
                            node {
                                id
                                relation_id_2
                                volume_bbg_rebate
                                residential_rebate_amount
                                multi_unit_rebate_amount
                                commercial_rebate_amount
                                cust_builder_residential_amount
                                cust_builder_commercial_amount
                                cust_builder_multi_unit_amount
                                cust_bbg_residential_amount
                                cust_bbg_commercial_amount
                                cust_bbg_multi_unit_amount
                                flat_builder_rebate
                                flat_bbg_rebate
                                rebate_amount_type
                                created_by
                                updated_by
                                created_at
                                updated_at
                            }
                        }
                    }
                    pricings2ndModel(first: 10000) {
                        edges {
                            node {
                                relation_id_2
                                volume_bbg_rebate
                            }
                        }
                    }
                }
            }
        }

        claims(first: 1, orderBy: [{ column: "updated_at", order: DESC }]) {
            edges {
                node {
                    id
                    status
                    updated_at
                }
            }
        }
        updated_by
        created_by
        pricings(first: 10000) {
            edges {
                node {
                    residential_rebate_amount
                    multi_unit_rebate_amount
                    commercial_rebate_amount
                    flat_bbg_rebate
                    flat_builder_rebate
                    volume_bbg_rebate
                }
            }
        }
        participants(first: 1000) {
            edges {
                node {
                    id
                    customProducts(first: 20) {
                        edges {
                            node {
                                id
                                name
                                bbg_product_code
                                customProductsPivot {
                                    program_id
                                    volume_bbg_rebate
                                }
                            }
                        }
                    }
                    programParticipantsPivot {
                        volume_bbg_rebate
                        residential_rebate_overwrite
                    }
                    organization_type
                    name
                }
            }
        }
        pivotPricings(relationModel: ORGANIZATION, first: 10000) {
            edges {
                node {
                    id
                    relation_id_2
                    volume_bbg_rebate
                    residential_rebate_amount
                    multi_unit_rebate_amount
                    commercial_rebate_amount
                    cust_builder_residential_amount
                    cust_builder_commercial_amount
                    cust_builder_multi_unit_amount
                    cust_bbg_residential_amount
                    cust_bbg_commercial_amount
                    cust_bbg_multi_unit_amount
                    flat_builder_rebate
                    flat_bbg_rebate
                    rebate_amount_type
                    created_by
                    updated_by
                    created_at
                    updated_at
                }
            }
        }
        trinaryPricings(relationModel: PRODUCT, relationModel2: ORGANIZATION, first: 100000) {
            edges {
                node {
                    id
                    relation_id_2
                    relation_id_3
                    volume_bbg_rebate
                    residential_rebate_amount
                    multi_unit_rebate_amount
                    commercial_rebate_amount
                    cust_builder_residential_amount
                    cust_builder_commercial_amount
                    cust_builder_multi_unit_amount
                    cust_bbg_residential_amount
                    cust_bbg_commercial_amount
                    cust_bbg_multi_unit_amount
                    flat_builder_rebate
                    flat_bbg_rebate
                    rebate_amount_type
                    created_by
                    updated_by
                    created_at
                    updated_at
                }
            }
        }
        pivotDistinctPricings(relationModel: ORGANIZATION, first: 10000) {
            edges {
                node {
                    id
                    relation_id_2
                    volume_bbg_rebate
                    residential_rebate_amount
                    multi_unit_rebate_amount
                    commercial_rebate_amount
                    cust_builder_residential_amount
                    cust_builder_commercial_amount
                    cust_builder_multi_unit_amount
                    cust_bbg_residential_amount
                    cust_bbg_commercial_amount
                    cust_bbg_multi_unit_amount
                    flat_builder_rebate
                    flat_bbg_rebate
                    rebate_amount_type
                    created_by
                    updated_by
                    created_at
                    updated_at
                }
            }
        }
        trinaryDistinctPricings(relationModel: PRODUCT, relationModel2: ORGANIZATION, first: 10000) {
            edges {
                node {
                    id
                    relation_id_2
                    relation_id_3
                    volume_bbg_rebate
                    residential_rebate_amount
                    multi_unit_rebate_amount
                    commercial_rebate_amount
                    cust_builder_residential_amount
                    cust_builder_commercial_amount
                    cust_builder_multi_unit_amount
                    cust_bbg_residential_amount
                    cust_bbg_commercial_amount
                    cust_bbg_multi_unit_amount
                    flat_builder_rebate
                    flat_bbg_rebate
                    rebate_amount_type
                    created_by
                    updated_by
                    created_at
                    updated_at
                }
            }
        }
        organizations(first: 10000) {
            edges {
                node {
                    id
                    organization_type
                    name
                }
            }
        }
    }
`;

export const CREATE_PROGRAM = gql`
    ${programNode}
    mutation createProgram(
        $name: String!
        $start_date: Date!
        $end_date: Date!
        $organizations: [ID!]
        $company: ID
        $participants: [ParticipantsProgramsPivot!]
        $type: ProgramType!
        $valid_region_type: ValidRegion
        $state: [ID!]
        $all_builder_report_quantity: Boolean
        $product_minimum_unit_requirement: productMinimumUnitRequirement
        $require_certificate_occupancy: Boolean
        $available_specific_member_only: Boolean
        $require_brand: Boolean
        $require_serial_number: Boolean
        $require_model_number: Boolean
        $require_date_of_installation: Boolean
        $require_date_of_purchase: Boolean
        $require_distributor: Boolean
        $global_product_minimum_unit: Int
        $global_product_residential_rebate_amount: Float
        $global_product_multi_unit_rebate_amount: Float
        $global_product_commercial_rebate_amount: Float
        $global_bbg_rebate_type: GlobalRebateType
        $bbg_rebate_unit: ProgramUnit
        $lot_and_address_requirement: ProgramAddressRequirement # $internal_description: String # $builder_description: String # $builder_description_short: String # $learn_more_url: String
        $is_flat_rebate: Boolean
        $flat_builder_rebate: Float
        $flat_bbg_rebate: Float
    ) {
        createProgram(
            input: {
                type: $type
                name: $name
                start_date: $start_date
                end_date: $end_date
                bbg_rebate_unit: $bbg_rebate_unit
                lot_and_address_requirement: $lot_and_address_requirement
                valid_region_type: $valid_region_type
                all_builder_report_quantity: $all_builder_report_quantity
                require_certificate_occupancy: $require_certificate_occupancy
                require_brand: $require_brand
                require_serial_number: $require_serial_number
                require_model_number: $require_model_number
                require_distributor: $require_distributor
                require_date_of_installation: $require_date_of_installation
                require_date_of_purchase: $require_date_of_purchase
                available_specific_member_only: $available_specific_member_only
                company: { connect: $company }
                organizations: { syncWithoutDetaching: $organizations }
                participants: { sync: $participants }
                global_bbg_rebate_type: $global_bbg_rebate_type
                global_product_minimum_unit: $global_product_minimum_unit
                global_product_rebate_amount_type: AMOUNT
                global_product_residential_rebate_amount: $global_product_residential_rebate_amount
                global_product_multi_unit_rebate_amount: $global_product_multi_unit_rebate_amount
                global_product_commercial_rebate_amount: $global_product_commercial_rebate_amount
                product_minimum_unit_requirement: $product_minimum_unit_requirement
                regions: { sync: $state }
                is_flat_rebate: $is_flat_rebate
                flat_builder_rebate: $flat_builder_rebate
                flat_bbg_rebate: $flat_bbg_rebate
            }
        ) {
            ...ProgramNodeFields
        }
    }
`;

export const UPDATE_PROGRAM = gql`
    ${programNode}
    mutation updateProgram(
        $id: ID!
        $name: String
        $start_date: Date
        $end_date: Date
        $organizations: [ID!]
        $company: ID
        $participants: [ParticipantsProgramsPivot]
        $type: ProgramType
        $valid_region_type: ValidRegion
        $state: [ID!]
        $all_builder_report_quantity: Boolean
        $product_minimum_unit_requirement: productMinimumUnitRequirement
        $require_certificate_occupancy: Boolean
        $require_brand: Boolean
        $require_serial_number: Boolean
        $require_model_number: Boolean
        $require_distributor: Boolean
        $available_specific_member_only: Boolean
        $require_date_of_installation: Boolean
        $require_date_of_purchase: Boolean
        $global_product_minimum_unit: Int
        $global_product_residential_rebate_amount: Float
        $global_product_multi_unit_rebate_amount: Float
        $global_product_commercial_rebate_amount: Float
        $global_bbg_rebate_type: GlobalRebateType
        $bbg_rebate_unit: ProgramUnit
        $lot_and_address_requirement: ProgramAddressRequirement
        $internal_description: String
        $builder_description: String
        $builder_description_short: String
        $learn_more_url: String
        $productsRebate: [ProductProgramSyncInput!]
        $removeProduct: [ID]
        $volume_bbg_rebate: Float
        $customParticipantsRebateProgram: [ParticipantsProgramsPivot]
        $upsert: [UpsertOrganizationRelationInput]
        $is_flat_rebate: Boolean
        $flat_builder_rebate: Float
        $flat_bbg_rebate: Float
        $create_pricing_array: [PricingRelationInput]
    ) {
        updateProgram(
            id: $id
            input: {
                type: $type
                name: $name
                start_date: $start_date
                end_date: $end_date
                volume_bbg_rebate: $volume_bbg_rebate
                products: { syncWithoutDetaching: $productsRebate, disconnect: $removeProduct }
                bbg_rebate_unit: $bbg_rebate_unit
                lot_and_address_requirement: $lot_and_address_requirement
                valid_region_type: $valid_region_type
                all_builder_report_quantity: $all_builder_report_quantity
                require_certificate_occupancy: $require_certificate_occupancy
                require_brand: $require_brand
                company: { connect: $company }
                require_serial_number: $require_serial_number
                require_model_number: $require_model_number
                require_distributor: $require_distributor
                require_date_of_installation: $require_date_of_installation
                require_date_of_purchase: $require_date_of_purchase
                organizations: { syncWithoutDetaching: $organizations }
                participants: {
                    sync: $participants
                    syncWithoutDetaching: $customParticipantsRebateProgram
                    upsert: $upsert
                }
                available_specific_member_only: $available_specific_member_only
                internal_description: $internal_description
                global_bbg_rebate_type: $global_bbg_rebate_type
                builder_description: $builder_description
                builder_description_short: $builder_description_short
                global_product_minimum_unit: $global_product_minimum_unit
                learn_more_url: $learn_more_url
                global_product_rebate_amount_type: AMOUNT
                global_product_residential_rebate_amount: $global_product_residential_rebate_amount
                global_product_multi_unit_rebate_amount: $global_product_multi_unit_rebate_amount
                global_product_commercial_rebate_amount: $global_product_commercial_rebate_amount
                product_minimum_unit_requirement: $product_minimum_unit_requirement
                regions: { sync: $state }
                is_flat_rebate: $is_flat_rebate
                flat_builder_rebate: $flat_builder_rebate
                flat_bbg_rebate: $flat_bbg_rebate
                pricings: { create: $create_pricing_array }
            }
        ) {
            ...ProgramNodeFields
        }
    }
`;

export const DELETE_PROGRAM = gql`
    mutation deleteProgram($id: ID!) {
        deleteProgram(id: $id) {
            id
        }
    }
`;

export const GET_PROGRAM_PRICING_HISTORY = gql`
    query getPricingHistoryByProgram($id: ID!) {
        program(id: $id) {
            pricings(first: 10000) {
                edges {
                    node {
                        residential_rebate_amount
                        commercial_rebate_amount
                        multi_unit_rebate_amount
                        flat_builder_rebate
                        flat_bbg_rebate
                        volume_bbg_rebate
                        created_at
                    }
                }
            }
        }
    }
`;

export const GET_PRODUCT_PRICING_HISTORY = gql`
    query getPricingHistoryByProduct($id: ID!) {
        product(id: $id) {
            pricings(first: 10000) {
                edges {
                    node {
                        residential_rebate_amount
                        commercial_rebate_amount
                        multi_unit_rebate_amount
                        flat_builder_rebate
                        flat_bbg_rebate
                        volume_bbg_rebate
                        created_at
                    }
                }
            }
        }
    }
`;

export const GET_PROGRAM_PRODUCT_ORGANIZATION_PRICING_HISTORY = gql`
    query getPricingHistoryByProgramProductOrganization($id: ID!, $product_id: ID!, $organization_id: ID!) {
        program(id: $id) {
            specificTrinaryPricings(
                relationModel: PRODUCT
                relationModel2: ORGANIZATION
                relationId: $product_id
                relationId2: $organization_id
                first: 10000
            ) {
                edges {
                    node {
                        volume_bbg_rebate
                        created_at
                    }
                }
            }
        }
    }
`;

export const GET_PROGRAM_PRODUCT_PRICING_HISTORY = gql`
    query getPricingHistoryByProgramProduct($program_id: ID!, $product_id: ID!) {
        program(id: $program_id) {
            specificPivotPricings(relationModel: PRODUCT, relationId: $product_id, first: 10000) {
                edges {
                    node {
                        residential_rebate_amount
                        commercial_rebate_amount
                        multi_unit_rebate_amount
                        flat_builder_rebate
                        flat_bbg_rebate
                        volume_bbg_rebate
                        created_at
                    }
                }
            }
        }
    }
`;

export const CREATE_PRODUCT = gql`
    mutation createProduct(
        $bbg_product_code: String
        $name: String!
        $category: UpdateProductCategoryInput
        $description: String
        $product_line: String
        $programID: ID
        $minimum_unit: Int
        $require_quantity_reporting: Boolean
        $residential_rebate_amount: Float
        $multi_unit_rebate_amount: Float
        $commercial_rebate_amount: Float
        $organization_id: ID
        $residential_builder_rebate_amount: Float
        $multi_builder_unit_rebate_amount: Float
        $commercial_builder_rebate_amount: Float
        $cust_bbg_residential_amount: Float
        $cust_builder_residential_amount: Float
        $cust_bbg_multi_unit_amount: Float
        $cust_builder_multi_unit_amount: Float
        $cust_bbg_commercial_amount: Float
        $cust_builder_commercial_amount: Float
        $customization_id: ID
        $flat_builder_rebate: Float
        $flat_bbg_rebate: Float
        $create_pricing_array: [PricingRelationInput]
    ) {
        createProduct(
            input: {
                bbg_product_code: $bbg_product_code
                name: $name
                category: { upsert: $category }
                product_line: $product_line
                description: $description
                minimum_unit: $minimum_unit
                require_quantity_reporting: $require_quantity_reporting
                rebate_amount_type: AMOUNT
                residential_rebate_amount: $residential_rebate_amount
                multi_unit_rebate_amount: $multi_unit_rebate_amount
                commercial_rebate_amount: $commercial_rebate_amount
                cust_bbg_residential_amount: $cust_bbg_residential_amount
                cust_bbg_commercial_amount: $cust_bbg_commercial_amount
                cust_bbg_multi_unit_amount: $cust_bbg_multi_unit_amount
                cust_builder_residential_amount: $cust_builder_residential_amount
                cust_builder_commercial_amount: $cust_builder_commercial_amount
                cust_builder_multi_unit_amount: $cust_builder_multi_unit_amount
                organizationOverwrites: {
                    syncWithoutDetaching: [
                        {
                            id: $organization_id
                            program_id: $programID
                            overwrite_amount_type: AMOUNT
                            residential_rebate_overwrite: $residential_builder_rebate_amount
                            multi_unit_rebate_overwrite: $multi_builder_unit_rebate_amount
                            commercial_rebate_overwrite: $commercial_builder_rebate_amount
                        }
                    ]
                }
                programs: { sync: [{ id: $programID, multi_reporting: false }] }
                customization_id: $customization_id
                flat_builder_rebate: $flat_builder_rebate
                flat_bbg_rebate: $flat_bbg_rebate
                pricings: { create: $create_pricing_array }
            }
        ) {
            id
            category {
                id
                name
            }
            bbg_product_code
            name
            description
            product_line
            created_at
            updated_at
            deleted_at
            minimum_unit
            rebate_amount_type
            require_quantity_reporting
            residential_rebate_amount
            commercial_rebate_amount
            multi_unit_rebate_amount
            cust_bbg_residential_amount
            cust_bbg_commercial_amount
            cust_bbg_multi_unit_amount
            cust_builder_residential_amount
            cust_builder_commercial_amount
            cust_builder_multi_unit_amount
            flat_builder_rebate
            flat_bbg_rebate
        }
    }
`;

export const UPDATE_PRODUCT = gql`
    mutation updateProduct(
        $id: ID!
        $bbg_product_code: String
        $name: String!
        $category: UpdateProductCategoryInput
        $description: String
        $product_line: String
        $programID: ID
        $minimum_unit: Int
        $require_quantity_reporting: Boolean
        $residential_rebate_amount: Float
        $multi_unit_rebate_amount: Float
        $commercial_rebate_amount: Float
        $cust_bbg_residential_amount: Float
        $cust_builder_residential_amount: Float
        $cust_bbg_multi_unit_amount: Float
        $cust_builder_multi_unit_amount: Float
        $cust_bbg_commercial_amount: Float
        $cust_builder_commercial_amount: Float
        $organization_id: ID
        $flat_builder_rebate: Float
        $flat_bbg_rebate: Float
        $create_pricing_array: [PricingRelationInput]
    ) {
        updateProduct(
            id: $id
            input: {
                bbg_product_code: $bbg_product_code
                name: $name
                category: { upsert: $category }
                product_line: $product_line
                description: $description
                minimum_unit: $minimum_unit
                rebate_amount_type: AMOUNT
                require_quantity_reporting: $require_quantity_reporting
                residential_rebate_amount: $residential_rebate_amount
                multi_unit_rebate_amount: $multi_unit_rebate_amount
                commercial_rebate_amount: $commercial_rebate_amount
                cust_bbg_residential_amount: $cust_bbg_residential_amount
                cust_bbg_commercial_amount: $cust_bbg_commercial_amount
                cust_bbg_multi_unit_amount: $cust_bbg_multi_unit_amount
                cust_builder_residential_amount: $cust_builder_residential_amount
                cust_builder_commercial_amount: $cust_builder_commercial_amount
                cust_builder_multi_unit_amount: $cust_builder_multi_unit_amount
                programs: { syncWithoutDetaching: [{ id: $programID, multi_reporting: false }] }
                organizationOverwrites: { syncWithoutDetaching: { id: $organization_id } }
                customization_id: $organization_id
                flat_builder_rebate: $flat_builder_rebate
                flat_bbg_rebate: $flat_bbg_rebate
                pricings: { create: $create_pricing_array }
            }
        ) {
            id
            name
            category {
                id
                name
            }
            bbg_product_code
            name
            description
            product_line
            created_at
            updated_at
            deleted_at
            minimum_unit
            require_quantity_reporting
            residential_rebate_amount
            multi_unit_rebate_amount
            commercial_rebate_amount
            cust_bbg_residential_amount
            cust_bbg_commercial_amount
            cust_bbg_multi_unit_amount
            cust_builder_residential_amount
            cust_builder_commercial_amount
            cust_builder_multi_unit_amount
            flat_builder_rebate
            flat_bbg_rebate
        }
    }
`;

export const CREATE_FLAT_PERCENT = gql`
    ${programNode}
    mutation createConversionFlatPercent(
        $name: String
        $id: ID
        $max_amount: Float
        $bonus_percent: Float
        $spend_time_range: ConversionTimeRange
        $clock_start: Date
        $anticipated_payment_date: Date
    ) {
        createConversionFlatPercent(
            input: {
                name: $name
                program: { connect: $id }
                max_amount: $max_amount
                bonus_percent: $bonus_percent
                spend_time_range: $spend_time_range
                clock_start: $clock_start
                anticipated_payment_date: $anticipated_payment_date
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            anticipated_payment_date
            bonus_percent
            max_amount
            spend_time_range
            clock_start
            created_by
            updated_by
        }
    }
`;

export const UPDATE_FLAT_PERCENT = gql`
    ${programNode}
    mutation updateConversionFlatPercent(
        $conversionId: ID!
        $name: String
        $id: ID
        $max_amount: Float
        $bonus_percent: Float
        $spend_time_range: ConversionTimeRange
        $clock_start: Date
        $anticipated_payment_date: Date
    ) {
        updateConversionFlatPercent(
            id: $conversionId
            input: {
                name: $name
                program: { connect: $id }
                max_amount: $max_amount
                bonus_percent: $bonus_percent
                spend_time_range: $spend_time_range
                clock_start: $clock_start
                anticipated_payment_date: $anticipated_payment_date
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            anticipated_payment_date
            bonus_percent
            max_amount
            spend_time_range
            clock_start
            created_by
            updated_by
        }
    }
`;

export const CREATE_FLAT_CONVERSION = gql`
    ${programNode}
    mutation createConversionFlatPayment($name: String, $id: ID, $amount: Float, $anticipated_payment_date: Date) {
        createConversionFlatPayment(
            input: {
                name: $name
                program: { connect: $id }
                amount: $amount
                anticipated_payment_date: $anticipated_payment_date
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            amount
            anticipated_payment_date
        }
    }
`;

export const UPDATE_FLAT_CONVERSION = gql`
    ${programNode}
    mutation updateConversionFlatPayment(
        $conversionId: ID!
        $name: String
        $id: ID
        $amount: Float
        $anticipated_payment_date: Date
    ) {
        updateConversionFlatPayment(
            id: $conversionId
            input: {
                name: $name
                program: { connect: $id }
                amount: $amount
                anticipated_payment_date: $anticipated_payment_date
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            amount
            anticipated_payment_date
        }
    }
`;

export const CREATE_TIRERED_CONVERSION = gql`
    ${programNode}
    mutation createConversionTieredPercent(
        $name: String
        $id: ID
        $max_amount: Float
        $anticipated_payment_date: Date
        $clock_start: Date
        $conversions: [ConversionTieredPercentTiersCreateInput!]
        $valid_period: ConversionTimeRange
    ) {
        createConversionTieredPercent(
            input: {
                name: $name
                program: { connect: $id }
                max_amount: $max_amount
                tiers: { create: $conversions }
                valid_period: $valid_period
                anticipated_payment_date: $anticipated_payment_date
                clock_start: $clock_start
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            anticipated_payment_date
            tiers(first: 100) {
                edges {
                    node {
                        id
                        bonus_amount
                        spend_exceed
                        note
                    }
                }
            }
            max_amount
            clock_start
            created_by
            updated_by
        }
    }
`;

export const UPDATE_TIRERED_CONVERSION = gql`
    ${programNode}
    mutation updateConversionTieredPercent(
        $conversionId: ID!
        $name: String
        $id: ID
        $max_amount: Float
        $anticipated_payment_date: Date
        $clock_start: Date
        $conversions: [ConversionTieredPercentTiersUpsertInput!]
        $valid_period: ConversionTimeRange
    ) {
        updateConversionTieredPercent(
            id: $conversionId
            input: {
                name: $name
                program: { connect: $id }
                max_amount: $max_amount
                tiers: { upsert: $conversions }
                valid_period: $valid_period
                anticipated_payment_date: $anticipated_payment_date
                clock_start: $clock_start
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            anticipated_payment_date
            tiers(first: 100) {
                edges {
                    node {
                        id
                        bonus_amount
                        spend_exceed
                        note
                    }
                }
            }
            max_amount
            clock_start
            created_by
            updated_by
        }
    }
`;

export const CREATE_ACTIVITY_PAYMENT = gql`
    ${programNode}
    mutation createConversionByActivity(
        $name: String
        $id: ID
        $product_included: ConversionActivityProduct
        $measure_unit: ConversionActivityUnit
        $trigger_amount: Float
        $bonus_name: String
        $bonus_amount: Float
        $residential_bonus_amount: Float
        $multi_unit_bonus_amount: Float
        $commercial_bonus_amount: Float
        $bonus_type: ConversionActivityType
    ) {
        createConversionByActivity(
            input: {
                name: $name
                program: { connect: $id }
                product_included: $product_included
                measure_unit: $measure_unit
                trigger_amount: $trigger_amount
                bonus_name: $bonus_name
                bonus_type: $bonus_type
                bonus_amount: $bonus_amount
                residential_bonus_amount: $residential_bonus_amount
                multi_unit_bonus_amount: $multi_unit_bonus_amount
                commercial_bonus_amount: $commercial_bonus_amount
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            product_included
            measure_unit
            trigger_amount
            bonus_name
            bonus_type
        }
    }
`;

export const UPDATE_ACTIVITY_PAYMENT = gql`
    ${programNode}
    mutation updateConversionByActivity(
        $conversionId: ID!
        $name: String
        $id: ID
        $product_included: ConversionActivityProduct
        $measure_unit: ConversionActivityUnit
        $trigger_amount: Float
        $bonus_name: String
        $bonus_amount: Float
        $residential_bonus_amount: Float
        $multi_unit_bonus_amount: Float
        $commercial_bonus_amount: Float
        $bonus_type: ConversionActivityType
    ) {
        updateConversionByActivity(
            id: $conversionId
            input: {
                name: $name
                program: { connect: $id }
                product_included: $product_included
                measure_unit: $measure_unit
                trigger_amount: $trigger_amount
                bonus_name: $bonus_name
                bonus_type: $bonus_type
                bonus_amount: $bonus_amount
                residential_bonus_amount: $residential_bonus_amount
                multi_unit_bonus_amount: $multi_unit_bonus_amount
                commercial_bonus_amount: $commercial_bonus_amount
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            product_included
            measure_unit
            trigger_amount
            bonus_name
            bonus_type
        }
    }
`;

export const CREATE_SPECIFIC_ACTIVITY_PAYMENT = gql`
    ${programNode}
    mutation createConversionByActivity(
        $name: String
        $id: ID
        $product_included: ConversionActivityProduct
        $measure_unit: ConversionActivityUnit
        $trigger_amount: Float
        $bonus_name: String
        $bonus_amount: Float
        $residential_bonus_amount: Float
        $commercial_bonus_amount: Float
        $multi_unit_bonus_amount: Float
        $bonus_type: ConversionActivityType
        $products: [ConverionActivityProductRelationInput]
    ) {
        createConversionByActivity(
            input: {
                name: $name
                program: { connect: $id }
                products: { sync: $products }
                product_included: $product_included
                measure_unit: $measure_unit
                trigger_amount: $trigger_amount
                bonus_name: $bonus_name
                residential_bonus_amount: $residential_bonus_amount
                commercial_bonus_amount: $commercial_bonus_amount
                multi_unit_bonus_amount: $multi_unit_bonus_amount
                bonus_type: $bonus_type
                bonus_amount: $bonus_amount
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            product_included
            measure_unit
            trigger_amount
            bonus_name
            bonus_type
            bonus_amount
        }
    }
`;

export const UPDATE_SPECIFIC_ACTIVITY_PAYMENT = gql`
    ${programNode}
    mutation updateConversionByActivity(
        $conversionId: ID!
        $name: String
        $id: ID
        $product_included: ConversionActivityProduct
        $measure_unit: ConversionActivityUnit
        $trigger_amount: Float
        $bonus_name: String
        $bonus_amount: Float
        $residential_bonus_amount: Float
        $commercial_bonus_amount: Float
        $multi_unit_bonus_amount: Float
        $bonus_type: ConversionActivityType
        $products: [ConverionActivityProductRelationInput]
    ) {
        updateConversionByActivity(
            id: $conversionId
            input: {
                name: $name
                program: { connect: $id }
                products: { sync: $products }
                product_included: $product_included
                measure_unit: $measure_unit
                trigger_amount: $trigger_amount
                bonus_name: $bonus_name
                residential_bonus_amount: $residential_bonus_amount
                commercial_bonus_amount: $commercial_bonus_amount
                multi_unit_bonus_amount: $multi_unit_bonus_amount
                bonus_type: $bonus_type
                bonus_amount: $bonus_amount
            }
        ) {
            id
            name
            program {
                ...ProgramNodeFields
            }
            product_included
            measure_unit
            trigger_amount
            bonus_name
            bonus_type
            bonus_amount
        }
    }
`;

export const DELETE_ACITIVTY_CONVERSION = gql`
    ${programNode}
    mutation deleteConversionByActivity($id: ID!) {
        deleteConversionByActivity(id: $id) {
            id
            program {
                ...ProgramNodeFields
            }
        }
    }
`;

export const DELETE_FLAT_PAYMENT_CONVERSION = gql`
    ${programNode}
    mutation deleteConversionFlatPayment($id: ID!) {
        deleteConversionFlatPayment(id: $id) {
            id
            program {
                ...ProgramNodeFields
            }
        }
    }
`;
export const DELETE_FLAT_PERCENT_CONVERSION = gql`
    ${programNode}
    mutation deleteConversionFlatPercent($id: ID!) {
        deleteConversionFlatPercent(id: $id) {
            id
            program {
                ...ProgramNodeFields
            }
        }
    }
`;
export const DELETE_TIERED_CONVERSION = gql`
    ${programNode}
    mutation deleteConversionTieredPercent($id: ID!) {
        deleteConversionTieredPercent(id: $id) {
            id
            program {
                ...ProgramNodeFields
            }
        }
    }
`;

export const CREATE_CONVERSION_PAYMENT = gql`
    mutation createConversionPayment(
        $conversion_type: conversionType
        $conversion_id: Int
        $amount: Float
        $payment_date: Date
        $note: String
    ) {
        createConversionPayment(
            input: {
                conversion_type: $conversion_type
                conversion_id: $conversion_id
                amount: $amount
                payment_date: $payment_date
                note: $note
            }
        ) {
            id
            amount
            payment_date
        }
    }
`;

export const FETCH_PRODUCTS_PER_PROGRAM = gql`
    query productsPerProgram($programId: ID!, $organization_id: ID) {
        productsPerProgram(programId: $programId, first: 20000) {
            edges {
                node {
                    id
                    category {
                        id
                        name
                    }
                    bbg_product_code
                    name
                    description
                    programs(first: 20) {
                        edges {
                            node {
                                name
                                id
                            }
                        }
                    }
                    product_line
                    created_at
                    updated_at
                    deleted_at
                    minimum_unit
                    rebate_amount_type
                    customization_id
                    organizationOverwritesPivotById(program_id: $programId, organization_id: $organization_id) {
                        overwrite_amount_type
                        residential_rebate_overwrite
                        multi_unit_rebate_overwrite
                        commercial_rebate_overwrite
                        flat_builder_overwrite
                        flat_bbg_overwrite
                    }
                    require_quantity_reporting
                    residential_rebate_amount
                    commercial_rebate_amount
                    multi_unit_rebate_amount
                    cust_bbg_residential_amount
                    cust_bbg_commercial_amount
                    cust_bbg_multi_unit_amount
                    cust_builder_residential_amount
                    cust_builder_commercial_amount
                    cust_builder_multi_unit_amount
                    flat_builder_rebate
                    flat_bbg_rebate
                }
            }
        }
    }
`;

export const FETCH_PROGRAMS_QUERY = gql`
    query programs($after: String) {
        programs(first: 100, after: $after, orderBy: [{ column: "updated_at", order: DESC }]) {
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
                    type
                    company {
                        name
                        id
                    }
                }
            }
        }
    }
`;

export const FETCH_ALL_PROGRAMS = gql`
    query programs($after: String, $programtype: [ProgramType]) {
        programs(
            first: 200000
            after: $after
            orderBy: [{ column: "updated_at", order: DESC }]
            programType: $programtype
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
                    type
                    company {
                        name
                        id
                    }
                    products(first: 20) {
                        edges {
                            node {
                                id
                                name
                                bbg_product_code
                                category {
                                    id
                                    name
                                }
                                programs(first: 3) {
                                    edges {
                                        node {
                                            name
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
`;

export const FETCH_PROGRAM = gql`
    ${programNode}
    query program($id: ID) {
        program(id: $id) {
            ...ProgramNodeFields
        }
    }
`;

export const FETCH_SEARCHED_PROGRAMS = gql`
    ${programNode}
    query searchPrograms($search: String) {
        searchPrograms(first: 100, search: $search) {
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
                    ...ProgramNodeFields
                }
            }
        }
    }
`;

export const SEARCH_ORGANIZATION_AVAILABLE_PROGRAMS = gql`
    ${programNode}
    query searchOrganizationAvailablePrograms($search: String, $id: ID!, $excludeUsedProgram: Boolean) {
        searchOrganizationAvailablePrograms(
            first: 100
            search: $search
            id: $id
            excludeUsedProgram: $excludeUsedProgram
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
                    ...ProgramNodeFields
                }
            }
        }
    }
`;

export const FETCH_SEARCHED_PROGRAMS_FOR_CLAIMS = gql`
    query searchClaimablePrograms($search: String) {
        searchClaimablePrograms(first: 100, search: $search) {
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
                    type
                    company {
                        id
                        name
                    }
                    claims(first: 2, orderBy: [{ column: "updated_at", order: DESC }]) {
                        edges {
                            node {
                                id
                                status
                                updated_at
                                claim_type
                                report_period
                                report_year
                                report_quarter
                                claim_start_date
                                claim_end_date
                                total_payment_rebate
                                report_total
                            }
                        }
                    }
                    allClaimTemplateProducts(first: 20) {
                        edges {
                            node {
                                customization {
                                    id
                                }
                                id
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_CATEGORIES_QUERY = gql`
    query {
        productCategories(first: 10000) {
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
                    name
                }
            }
        }
    }
`;

export const FETCH_PORTAL_PROGRAMS = gql`
    query portalPrograms($tags: [ID]) {
        programs(first: 1000000, where: { tagIn: $tags }) {
            edges {
                node {
                    blocksJSON
                    content
                    title
                    slug
                    programsDownloads {
                        addMore {
                            downloadName
                            file {
                                mediaItemUrl
                                sourceUrl
                                uri
                            }
                        }
                        downloadName
                        file {
                            mediaItemUrl
                        }
                    }
                    tags {
                        edges {
                            node {
                                name
                                databaseId
                            }
                        }
                    }
                    featuredImage {
                        node {
                            sourceUrl
                            altText
                        }
                    }
                    excerpt
                    blocks {
                        attributesJSON
                        name
                        innerBlocks {
                            attributesJSON
                            name
                            innerBlocks {
                                attributesJSON
                                name
                                innerBlocks {
                                    attributesJSON
                                    name
                                    innerBlocks {
                                        attributesJSON
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
