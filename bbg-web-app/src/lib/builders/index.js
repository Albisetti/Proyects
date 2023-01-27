import gql from "graphql-tag";

export const organizationNode = gql`
    fragment OrganizationNodeFields on Organizations {
        organization_type
        id
        isPeriodClosing
        name
        abbreviation
        code
        phone_number
        thisYearsDue {
            id
            annual_dues
            prorated_amount
        }
        approved_states(first: 10) {
            edges {
                node {
                    id
                    name
                }
            }
        }
        state {
            id
            name
        }
        city
        previousEarnedToDate
        address
        address2
        zip_postal
        notes
        member_tier
        thisYearsDue {
            annual_dues
        }
        users(first: 10000) {
            edges {
                node {
                    type
                    id
                    first_name
                    last_name
                    title
                    email
                    office_phone
                    office_phone_ext
                    mobile_phone
                    fullName
                    require_user_account
                    organizations(first: 1) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            }
        }
        subcontractors(first: 10) {
            edges {
                node {
                    id
                    company_name
                }
            }
        }
        created_at
        updated_at
        territoryManagers(first: 1) {
            edges {
                node {
                    id
                    first_name
                    last_name
                    fullName
                }
            }
        }
        availablePrograms(first: 1000) {
            edges {
                node {
                    id
                    name
                    type
                    company {
                        id
                        name
                    }
                    global_product_multi_unit_rebate_amount
                    global_product_commercial_rebate_amount
                    global_product_residential_rebate_amount
                    product_minimum_unit_requirement
                    global_product_minimum_unit
                    volume_bbg_rebate
                    all_builder_report_quantity

                    is_flat_rebate
                    flat_builder_rebate
                    flat_bbg_rebate

                    global_bbg_rebate_type

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
                }
            }
        }
        programs(first: 1000) {
            edges {
                node {
                    id
                    name
                    type
                    company {
                        id
                        name
                    }
                    global_product_multi_unit_rebate_amount
                    global_product_commercial_rebate_amount
                    global_product_residential_rebate_amount
                    product_minimum_unit_requirement
                    global_product_minimum_unit
                    volume_bbg_rebate
                    all_builder_report_quantity

                    is_flat_rebate
                    flat_builder_rebate
                    flat_bbg_rebate

                    global_bbg_rebate_type

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
                }
            }
        }
        customProducts(first: 10) {
            edges {
                node {
                    id
                    name
                    customProductsPivot {
                        program_id
                        overwrite_amount_type
                        residential_rebate_overwrite
                        multi_unit_rebate_overwrite
                        commercial_rebate_overwrite
                        flat_builder_overwrite
                        flat_bbg_overwrite
                    }
                }
            }
        }
    }
`;

export const GET_BUILDERS = gql`
    query organizations($after: String) {
        organizations(
            organization_type: [BUILDERS]
            first: 20
            after: $after
            orderBy: [{ column: "name", order: ASC }]
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
                    organization_type
                    isPeriodClosing
                    created_at
                    updated_at
                }
            }
        }
    }
`;

export const GET_BUILDER = gql`
    query organization($id: ID!) {
        organization(id: $id) {
            organization_type
            id
            name
            abbreviation
            code
            phone_number
            isPeriodClosing
            thisYearsDue {
                id
                annual_dues
                prorated_amount
            }
            approved_states(first: 10) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
            state {
                id
                name
            }
            city
            previousEarnedToDate
            address
            address2
            zip_postal
            notes
            member_tier
            territoryManagers(first: 1) {
                edges {
                    node {
                        id
                        first_name
                        last_name
                        fullName
                    }
                }
            }
        }
    }
`;

export const GET_BUILDER_PROGRAMS = gql`
    query organization($id: ID!) {
        organization(id: $id) {
            availablePrograms(first: 1000) {
                edges {
                    node {
                        id
                        name
                        type
                        company {
                            id
                            name
                        }
                        global_product_multi_unit_rebate_amount
                        global_product_commercial_rebate_amount
                        global_product_residential_rebate_amount
                        product_minimum_unit_requirement
                        global_product_minimum_unit
                        volume_bbg_rebate
                        all_builder_report_quantity

                        is_flat_rebate
                        flat_builder_rebate
                        flat_bbg_rebate

                        global_bbg_rebate_type

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
                    }
                }
            }
            programs(first: 1000) {
                edges {
                    node {
                        id
                        name
                        type
                        company {
                            id
                            name
                        }
                        global_product_multi_unit_rebate_amount
                        global_product_commercial_rebate_amount
                        global_product_residential_rebate_amount
                        product_minimum_unit_requirement
                        global_product_minimum_unit
                        volume_bbg_rebate
                        all_builder_report_quantity

                        is_flat_rebate
                        flat_builder_rebate
                        flat_bbg_rebate

                        global_bbg_rebate_type

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
                    }
                }
            }
            customProducts(first: 10) {
                edges {
                    node {
                        id
                        name
                        customProductsPivot {
                            program_id
                            overwrite_amount_type
                            residential_rebate_overwrite
                            multi_unit_rebate_overwrite
                            commercial_rebate_overwrite
                            flat_builder_overwrite
                            flat_bbg_overwrite
                        }
                    }
                }
            }
        }
    }
`;

export const GET_BUILDER_PROGRAMS_MY_PROGRAMS_PAGE = gql`
    query organization($id: ID!) {
        organization(id: $id) {
            availablePrograms(first: 1000) {
                edges {
                    node {
                        id
                        name
                        type
                        company {
                            id
                            name
                        }
                    }
                }
            }
            programs(first: 1000) {
                edges {
                    node {
                        id
                        name
                        type
                        company {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`;

export const GET_BUILDER_USERS = gql`
    query organization($id: ID!) {
        organization(id: $id) {
            users(first: 10000) {
                edges {
                    node {
                        type
                        id
                        first_name
                        last_name
                        title
                        email
                        office_phone
                        office_phone_ext
                        mobile_phone
                        fullName
                        require_user_account
                        organizations(first: 1) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                    }
                }
            }
            subcontractors(first: 10) {
                edges {
                    node {
                        id
                        company_name
                    }
                }
            }
        }
    }
`;

export const SEARCH_BUILDERS = gql`
    query searchOrganizations($after: String, $search: String) {
        searchOrganizations(
            search: $search
            first: 20
            after: $after
            organization_type: [BUILDERS]
            orderBy: [{ column: "name", order: ASC }]
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
                    organization_type
                    isPeriodClosing
                    created_at
                    updated_at
                }
            }
        }
    }
`;

export const CREATE_BUILDER = gql`
    ${organizationNode}
    mutation createOrganization(
        $name: String
        $abbreviation: String
        $code: String
        $state_id: Int
        $city: String
        $address: String
        $address2: String
        $organization_type: OrganizationType!
        $territoryManagers: [ID]
        $zip_postal: String
    ) {
        createOrganization(
            input: {
                organization_type: $organization_type
                name: $name
                abbreviation: $abbreviation
                code: $code
                state_id: $state_id
                city: $city
                address: $address
                address2: $address2
                zip_postal: $zip_postal
                territoryManagers: { sync: $territoryManagers }
            }
        ) {
            ...OrganizationNodeFields
        }
    }
`;

export const UPDATE_USER = gql`
    ${organizationNode}
    mutation updateOrganization($id: ID, $organization_type: OrganizationType, $users: OrganizationUserRelation) {
        updateOrganization(id: $id, input: { organization_type: $organization_type, users: $users }) {
            ...OrganizationNodeFields
        }
    }
`;

export const UPDATE_BUILDER_CUSTOM_PRODUCT = gql`
    mutation updateProduct(
        $id: ID!
        $cust_bbg_residential_amount: Float
        $cust_bbg_commercial_amount: Float
        $cust_bbg_multi_unit_amount: Float
        $cust_builder_residential_amount: Float
        $cust_builder_commercial_amount: Float
        $cust_builder_multi_unit_amount: Float
    ) {
        updateProduct(
            id: $id
            input: {
                cust_bbg_residential_amount: $cust_bbg_residential_amount
                cust_bbg_commercial_amount: $cust_bbg_commercial_amount
                cust_bbg_multi_unit_amount: $cust_bbg_multi_unit_amount
                cust_builder_residential_amount: $cust_builder_residential_amount
                cust_builder_commercial_amount: $cust_builder_commercial_amount
                cust_builder_multi_unit_amount: $cust_builder_multi_unit_amount
                rebate_amount_type: AMOUNT
            }
        ) {
            id
        }
    }
`;

export const UPDATE_BUILDER_PRODUCT = gql`
    mutation updateProduct(
        $id: ID!
        $rebate_amount_type: overwrite_amount_type
        $organization_id: ID
        $residential_rebate_amount: Float
        $commercial_rebate_amount: Float
        $multi_unit_rebate_amount: Float
        $flat_bbg_rebate: Float
        $flat_builder_rebate: Float
        $cust_bbg_residential_amount: Float
        $cust_bbg_commercial_amount: Float
        $cust_bbg_multi_unit_amount: Float
        $cust_builder_residential_amount: Float
        $cust_builder_commercial_amount: Float
        $cust_builder_multi_unit_amount: Float
    ) {
        updateProduct(
            id: $id
            input: {
                pricings: {
                    create: [
                        {
                            relation_model_2: ORGANIZATION
                            relation_id_2: $organization_id
                            residential_rebate_amount: $residential_rebate_amount
                            commercial_rebate_amount: $commercial_rebate_amount
                            multi_unit_rebate_amount: $multi_unit_rebate_amount
                            flat_bbg_rebate: $flat_bbg_rebate
                            flat_builder_rebate: $flat_builder_rebate
                            cust_bbg_residential_amount: $cust_bbg_residential_amount
                            cust_bbg_commercial_amount: $cust_bbg_commercial_amount
                            cust_bbg_multi_unit_amount: $cust_bbg_multi_unit_amount
                            cust_builder_residential_amount: $cust_builder_residential_amount
                            cust_builder_commercial_amount: $cust_builder_commercial_amount
                            cust_builder_multi_unit_amount: $cust_builder_multi_unit_amount
                            rebate_amount_type: $rebate_amount_type
                        }
                    ]
                }
            }
        ) {
            id
        }
    }
`;

export const UPDATE_BUILDER = gql`
    ${organizationNode}
    mutation updateOrganization(
        $id: ID
        $name: String
        $abbreviation: String
        $code: String
        $state_id: Int
        $city: String
        $address: String
        $address2: String
        $zip_postal: String
        $organization_type: OrganizationType
        $territoryManagers: [ID]
        $approved_states: [ID]
        $member_tier: MemberTier
        $users: OrganizationUserRelation
        $dues: OrganizationDueUpdateRelation
        $programOverwrites: [ParticipantsProgramsPivot]
        $customProductsPivot: CustomProductPivot
    ) {
        updateOrganization(
            id: $id
            input: {
                organization_type: $organization_type
                name: $name
                abbreviation: $abbreviation
                code: $code
                state_id: $state_id
                city: $city
                address: $address
                address2: $address2
                zip_postal: $zip_postal
                territoryManagers: { sync: $territoryManagers }
                approved_states: { sync: $approved_states }
                member_tier: $member_tier
                dues: $dues
                users: $users
                customProducts: { syncWithoutDetaching: [$customProductsPivot] }
                programs: { syncWithoutDetaching: $programOverwrites }
            }
        ) {
            ...OrganizationNodeFields
        }
    }
`;

export const UPDATE_BUILDER_REMOVE_PROGRAM = gql`
    ${organizationNode}
    mutation updateOrganization($id: ID, $programId: [ID]) {
        updateOrganization(id: $id, input: { programs: { disconnect: $programId } }) {
            ...OrganizationNodeFields
        }
    }
`;

export const UPDATE_BUILDER_ADD_PROGRAM = gql`
    mutation updateOrganization($id: ID, $programOverwrites: [ParticipantsProgramsPivot]) {
        updateOrganization(id: $id, input: { programs: { syncWithoutDetaching: $programOverwrites } }) {
            organization_type
            id
            name
            abbreviation
            code
            phone_number
            thisYearsDue {
                id
                annual_dues
                prorated_amount
            }
            approved_states(first: 10) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
            state {
                id
                name
            }
            city
            previousEarnedToDate
            address
            address2
            zip_postal
            notes
            member_tier
            territoryManagers(first: 1) {
                edges {
                    node {
                        id
                        first_name
                        last_name
                        fullName
                    }
                }
            }
            availablePrograms(first: 1000) {
                edges {
                    node {
                        id
                        name
                        type
                        company {
                            id
                            name
                        }
                        global_product_multi_unit_rebate_amount
                        global_product_commercial_rebate_amount
                        global_product_residential_rebate_amount
                        product_minimum_unit_requirement
                        global_product_minimum_unit
                        volume_bbg_rebate
                        all_builder_report_quantity

                        is_flat_rebate
                        flat_builder_rebate
                        flat_bbg_rebate

                        global_bbg_rebate_type

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
                    }
                }
            }
            programs(first: 1000) {
                edges {
                    node {
                        id
                        name
                        type
                        company {
                            id
                            name
                        }
                        global_product_multi_unit_rebate_amount
                        global_product_commercial_rebate_amount
                        global_product_residential_rebate_amount
                        product_minimum_unit_requirement
                        global_product_minimum_unit
                        volume_bbg_rebate
                        all_builder_report_quantity

                        is_flat_rebate
                        flat_builder_rebate
                        flat_bbg_rebate

                        global_bbg_rebate_type

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
                    }
                }
            }
        }
    }
`;

export const UPDATE_BUILDER_ADD_PROGRAM_MY_PROGRAMS_PAGE = gql`
    mutation updateOrganization($id: ID, $programOverwrites: [ParticipantsProgramsPivot]) {
        updateOrganization(id: $id, input: { programs: { syncWithoutDetaching: $programOverwrites } }) {
            organization_type
            id
            name
            availablePrograms(first: 1000) {
                edges {
                    node {
                        id
                        name
                        type
                        company {
                            id
                            name
                        }
                    }
                }
            }
            programs(first: 1000) {
                edges {
                    node {
                        id
                        name
                        type
                        company {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`;

export const UPDATE_BUILDER_MEMBERSHIP = gql`
    ${organizationNode}
    mutation updateOrganization(
        $id: ID
        $name: String
        $abbreviation: String
        $code: String
        $state_id: Int
        $city: String
        $address: String
        $address2: String
        $zip_postal: String
        $previousEarnedToDate: Float
        $organization_type: OrganizationType
        $territoryManagers: [ID]
        $approved_states: [ID]
        $member_tier: MemberTier
        $users: OrganizationUserRelation
        $dues: OrganizationDueUpdateRelation
    ) {
        updateOrganization(
            id: $id
            input: {
                organization_type: $organization_type
                name: $name
                abbreviation: $abbreviation
                code: $code
                state_id: $state_id
                city: $city
                address: $address
                address2: $address2
                previousEarnedToDate: $previousEarnedToDate
                zip_postal: $zip_postal
                territoryManagers: { sync: $territoryManagers }
                approved_states: { sync: $approved_states }
                member_tier: $member_tier
                dues: $dues
                users: $users
            }
        ) {
            ...OrganizationNodeFields
        }
    }
`;

export const UPDATE_BUILDER_OVERRITES = gql`
    mutation updateOrganizationProgramOverwrites(
        $id: ID
        $program_id: ID!
        $overwrite_amount_type: overwrite_amount_type
        $volume_bbg_rebate: Float
        $residential_rebate_overwrite: Float
        $multi_unit_rebate_overwrite: Float
        $commercial_rebate_overwrite: Float
        $flat_builder_overwrite: Float
        $flat_bbg_overwrite: Float
    ) {
        updateProgram(
            id: $program_id
            input: {
                pricings: {
                    create: [
                        {
                            relation_model_2: ORGANIZATION
                            relation_id_2: $id
                            volume_bbg_rebate: $volume_bbg_rebate
                            residential_rebate_amount: $residential_rebate_overwrite
                            multi_unit_rebate_amount: $multi_unit_rebate_overwrite
                            commercial_rebate_amount: $commercial_rebate_overwrite
                            flat_builder_rebate: $flat_builder_overwrite
                            flat_bbg_rebate: $flat_bbg_overwrite
                            rebate_amount_type: $overwrite_amount_type
                        }
                    ]
                }
            }
        ) {
            id
        }
    }
`;

export const GET_TERRITORY_MANAGERS = gql`
    query {
        users(first: 10000, user_type: TERRITORY_MANAGER) {
            edges {
                node {
                    id
                    first_name
                    last_name
                    fullName
                }
            }
        }
    }
`;

export const GET_PROGRAM_ORGANIZATION_PRICING_HISTORY = gql`
    query getPricingHistoryByProgramOrganization($program_id: ID!, $organization_id: ID!) {
        program(id: $program_id) {
            specificPivotPricings(relationModel: ORGANIZATION, relationId: $organization_id, first: 10000) {
                edges {
                    node {
                        residential_rebate_amount
                        commercial_rebate_amount
                        multi_unit_rebate_amount
                        cust_builder_residential_amount
                        cust_builder_commercial_amount
                        cust_builder_multi_unit_amount
                        cust_bbg_residential_amount
                        cust_bbg_commercial_amount
                        cust_bbg_multi_unit_amount
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

export const GET_PRODUCT_ORGANIZATION_PRICING_HISTORY = gql`
    query getPricingHistoryByProductOrganization($product_id: ID!, $organization_id: ID!) {
        product(id: $product_id) {
            specificPivotPricings(relationModel: ORGANIZATION, relationId: $organization_id, first: 10000) {
                edges {
                    node {
                        residential_rebate_amount
                        commercial_rebate_amount
                        multi_unit_rebate_amount
                        cust_builder_residential_amount
                        cust_builder_commercial_amount
                        cust_builder_multi_unit_amount
                        cust_bbg_residential_amount
                        cust_bbg_commercial_amount
                        cust_bbg_multi_unit_amount
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
