import gql from "graphql-tag";

export const claimNode = gql`
    fragment claimNodeFields on Claims {
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
        supplier_report(first: 10) {
            edges {
                node {
                    id
                    path
                }
            }
        }
        volumeClaimsBuilderRebates(first: 20000) {
            edges {
                node {
                    name
                    volumeClaimsBuilderRebatesPivot {
                        volumeClaim_id
                        rebate_earned
                        rebate_adjusted
                        note
                        builder_id
                        builder_allocation
                        total_allocation
                    }
                }
            }
        }
        buildersWithOpenRebateBeforeEndDate(excludeActionRequired: $excludeActionRequired) {
            id
            name
            rebateReports {
                id
                NeedActionHousesMissingCoCount
                NeedActionHousesMissingAddressCount
                ReadiedHouses {
                    model {
                        id
                        lot_number
                        address
                        address2
                        project_number
                        model
                    }
                    pivots {
                        id
                        product_quantity
                        houseProgramCount
                        requireFieldStatusPerHouse {
                            brand_correct
                            serial_number_correct
                            model_number_correct
                            date_of_installation_correct
                            date_of_purchase_correct
                            distributor_correct
                            certificate_occupancy_correct
                        }
                        products {
                            id
                            category {
                                id
                                name
                            }
                            require_quantity_reporting
                            programs {
                                id
                                name
                            }
                            minimum_unit
                            name
                            bbg_product_code
                        }
                    }
                }
                NeedActionHousesWithCoAndAddress {
                    model {
                        id
                        lot_number
                        address
                        address2
                        project_number
                        model
                    }
                    pivots {
                        id
                        product_quantity
                        requireFieldStatusPerHouse {
                            brand_correct
                            serial_number_correct
                            model_number_correct
                            date_of_installation_correct
                            date_of_purchase_correct
                            distributor_correct
                            certificate_occupancy_correct
                        }
                        products {
                            minimum_unit
                            id
                            category {
                                id
                            }
                            name
                            bbg_product_code
                        }
                    }
                }
            }
        }
        disputes(first: 10) {
            edges {
                node {
                    id
                    status
                    note
                    new_product_quantity
                    new_rebate_earned
                    new_rebate_adjusted
                    new_builder_allocation
                    new_total_allocation
                }
            }
        }
        program {
            id
            name
            type
            is_flat_rebate
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
            claims(first: 2, orderBy: [{ column: "id", order: DESC }]) {
                edges {
                    node {
                        id
                        status
                        updated_at
                        claim_type
                        overwrite_note
                        report_period
                        report_year
                        report_quarter
                        claim_start_date
                        claim_end_date
                        total_payment_rebate
                        report_total
                        total_manual_set
                    }
                }
            }
        }
        rebateReports(first: 10) {
            edges {
                node {
                    id
                    readyForClaim
                    rebateReports {
                        id
                    }
                    houses {
                        id
                    }
                    products {
                        id
                    }
                    status
                    product_quantity
                    claimPivot {
                        rebate_earned
                        rebate_adjusted
                        builder_allocation
                        total_allocation
                        note
                    }
                    disputed
                    dispute {
                        id
                        status
                        note
                        new_product_quantity
                        new_rebate_earned
                        new_rebate_adjusted
                        new_builder_allocation
                        new_total_allocation
                    }
                }
            }
        }

        propertyUnitCount {
            type
            count
        }

        allManufacturersAndSuppliersNotes
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
    }
`;

export const lighterClaimNode = gql`
    fragment claimNodeFields on Claims {
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
        supplier_report(first: 10) {
            edges {
                node {
                    id
                    path
                }
            }
        }
        volumeClaimsBuilderRebates(first: 20000) {
            edges {
                node {
                    name
                    volumeClaimsBuilderRebatesPivot {
                        volumeClaim_id
                        rebate_earned
                        rebate_adjusted
                        note
                        builder_id
                        builder_allocation
                        total_allocation
                    }
                }
            }
        }
        buildersWithOpenRebateBeforeEndDate(excludeActionRequired: $excludeActionRequired) {
            id
            name
            rebateReports {
                id
                NeedActionHousesMissingCoCount
                NeedActionHousesMissingAddressCount
                ReadiedHouses {
                    model {
                        id
                        lot_number
                        address
                        address2
                        project_number
                        model
                    }
                    pivots {
                        id
                        product_quantity
                        houseProgramCount
                        requireFieldStatusPerHouse {
                            brand_correct
                            serial_number_correct
                            model_number_correct
                            date_of_installation_correct
                            date_of_purchase_correct
                            distributor_correct
                            certificate_occupancy_correct
                        }
                        products {
                            id
                            category {
                                id
                                name
                            }
                            require_quantity_reporting
                            programs {
                                id
                                name
                            }
                            minimum_unit
                            name
                            bbg_product_code
                        }
                    }
                }
                NeedActionHousesWithCoAndAddress {
                    model {
                        id
                        lot_number
                        address
                        address2
                        project_number
                        model
                    }
                    pivots {
                        id
                        product_quantity
                        requireFieldStatusPerHouse {
                            brand_correct
                            serial_number_correct
                            model_number_correct
                            date_of_installation_correct
                            date_of_purchase_correct
                            distributor_correct
                            certificate_occupancy_correct
                        }
                        products {
                            minimum_unit
                            id
                            category {
                                id
                            }
                            name
                            bbg_product_code
                        }
                    }
                }
            }
        }
        disputes(first: 10) {
            edges {
                node {
                    id
                    status
                    note
                    new_product_quantity
                    new_rebate_earned
                    new_rebate_adjusted
                    new_builder_allocation
                    new_total_allocation
                }
            }
        }
        program {
            id
            name
            type
            is_flat_rebate
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
            claims(first: 2, orderBy: [{ column: "id", order: DESC }]) {
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
                        total_manual_set
                    }
                }
            }
        }
        rebateReports(first: 10) {
            edges {
                node {
                    id
                    readyForClaim
                    rebateReports {
                        id
                    }
                    houses {
                        id
                    }
                    products {
                        id
                    }
                    status
                    product_quantity
                    claimPivot {
                        rebate_earned
                        rebate_adjusted
                        builder_allocation
                        total_allocation
                        note
                    }
                    disputed
                    dispute {
                        id
                        status
                        note
                        new_product_quantity
                        new_rebate_earned
                        new_rebate_adjusted
                        new_builder_allocation
                        new_total_allocation
                    }
                }
            }
        }

        propertyUnitCount {
            type
            count
        }

        allManufacturersAndSuppliersNotes
    }
`;

export const allocationClaimNode = gql`
    fragment claimAllocationFields on Claims {
        buildersWithOpenRebateBeforeEndDate(excludeActionRequired: false) {
            id
            name
            rebateReports {
                id
                NeedActionHousesMissingCoCount
                NeedActionHousesMissingAddressCount
                ReadiedHouses {
                    model {
                        id
                        lot_number
                        address
                        address2
                        project_number
                        model
                    }
                    pivots {
                        id
                        product_quantity
                        houseProgramCount
                        requireFieldStatusPerHouse {
                            brand_correct
                            serial_number_correct
                            model_number_correct
                            date_of_installation_correct
                            date_of_purchase_correct
                            distributor_correct
                            certificate_occupancy_correct
                        }
                        products {
                            id
                            category {
                                id
                                name
                            }
                            require_quantity_reporting
                            programs {
                                id
                                name
                            }
                            minimum_unit
                            name
                            bbg_product_code
                        }
                    }
                }
                NeedActionHousesWithCoAndAddress {
                    model {
                        id
                        lot_number
                        address
                        address2
                        project_number
                        model
                    }
                    pivots {
                        id
                        product_quantity
                        requireFieldStatusPerHouse {
                            brand_correct
                            serial_number_correct
                            model_number_correct
                            date_of_installation_correct
                            date_of_purchase_correct
                            distributor_correct
                            certificate_occupancy_correct
                        }
                        products {
                            minimum_unit
                            id
                            category {
                                id
                            }
                            name
                            bbg_product_code
                        }
                    }
                }
            }
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
    }
`;

export const FETCH_CLAIMS = gql`
    query recentClaimPerProgram($after: String) {
        recentClaimPerProgram(first: 40, after: $after) {
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
                        is_flat_rebate
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
                        claims(first: 2, orderBy: [{ column: "id", order: DESC }]) {
                            edges {
                                node {
                                    id
                                    status
                                    updated_at
                                    claim_type
                                    overwrite_note
                                    report_period
                                    report_year
                                    report_quarter
                                    claim_start_date
                                    claim_end_date
                                    total_payment_rebate
                                    report_total
                                    total_manual_set
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_CLAIM = gql`
    ${claimNode}
    query claim($id: ID, $excludeActionRequired: Boolean) {
        claim(id: $id) {
            ...claimNodeFields
        }
    }
`;

export const FETCH_SMALL_CLAIM = gql`
    query claim($id: ID) {
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
                is_flat_rebate
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
        }
    }
`;

export const FETCH_CLAIM_HISTORY = gql`
    query claim($id: ID) {
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
                is_flat_rebate
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
        }
    }
`;

export const FETCH_CLAIM_BASIC = gql`
    query claim($id: ID, $excludeActionRequired: Boolean) {
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
                is_flat_rebate
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

            buildersWithOpenRebateBeforeEndDate(excludeActionRequired: $excludeActionRequired) {
                id
                name
                rebateReports {
                    id
                    NeedActionHousesMissingCoCount
                    NeedActionHousesMissingAddressCount
                    ReadiedHouses {
                        model {
                            id
                            lot_number
                            address
                            address2
                            project_number
                            model
                        }
                        pivots {
                            id
                            product_quantity
                            houseProgramCount
                            requireFieldStatusPerHouse {
                                brand_correct
                                serial_number_correct
                                model_number_correct
                                date_of_installation_correct
                                date_of_purchase_correct
                                distributor_correct
                                certificate_occupancy_correct
                            }
                            products {
                                id
                                category {
                                    id
                                    name
                                }
                                require_quantity_reporting
                                programs {
                                    id
                                    name
                                }
                                minimum_unit
                                name
                                bbg_product_code
                            }
                        }
                    }
                    NeedActionHousesWithCoAndAddress {
                        model {
                            id
                            lot_number
                            address
                            address2
                            project_number
                            model
                        }
                        pivots {
                            id
                            product_quantity
                            requireFieldStatusPerHouse {
                                brand_correct
                                serial_number_correct
                                model_number_correct
                                date_of_installation_correct
                                date_of_purchase_correct
                                distributor_correct
                                certificate_occupancy_correct
                            }
                            products {
                                minimum_unit
                                id
                                category {
                                    id
                                }
                                name
                                bbg_product_code
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const FETCH_VOLUME_CLAIM_TOTALS = gql`
    query claim($id: ID) {
        claim(id: $id) {
            id
            total_payment_rebate
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
        }
    }
`;

export const FETCH_AFTER_MUTATION_DISPUTE_CLAIM = gql`
    mutation calculateIndividualBuilderClaimAllocation($id: ID!, $builderId: ID!) {
        calculateIndividualBuilderClaimAllocation(id: $id, builderId: $builderId) {
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
            houseProductsForBuilder(orgId: $builderId, first: 100) {
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

export const FETCH_DISPUTE_CLAIM = gql`
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

export const FETCH_VOLUME_CLAIM = gql`
    ${claimNode}
    query volumeClaims($program_id: ID, $product_id: ID, $excludeActionRequired: Boolean) {
        volumeClaims(program_id: $program_id, product_id: $product_id) {
            currentClaim {
                ...claimNodeFields
            }
            lastClosedClaim {
                ...claimNodeFields
            }
        }
    }
`;

export const FETCH_SEARCHED_CLAIMS = gql`
    ${claimNode}
    query searchClaims($search: String, $excludeActionRequired: Boolean) {
        searchClaims(first: 100, search: $search) {
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
                    ...claimNodeFields
                }
            }
        }
    }
`;

export const CREATE_CLAIM = gql`
    ${claimNode}
    mutation createClaim(
        $claim_type: ClaimType
        $claim_start_date: DateTimeUtc
        $total_payment_rebate: Float
        $status: ClaimStatus
        $claim_end_date: DateTimeUtc
        $programId: ID
        $claimTemplateRelationInput: ClaimTemplateRelation
        $excludeActionRequired: Boolean
    ) {
        createClaim(
            input: {
                claim_type: $claim_type
                claim_start_date: $claim_start_date
                total_payment_rebate: $total_payment_rebate
                status: $status
                claim_end_date: $claim_end_date
                program: { connect: $programId }
                claim_template: $claimTemplateRelationInput
            }
        ) {
            ...claimNodeFields
        }
    }
`;

export const UPDATE_CLAIM = gql`
    ${claimNode}
    mutation updateClaim(
        $id: ID!
        $claim_type: ClaimType
        $claim_start_date: DateTimeUtc
        $total_payment_rebate: Float
        $status: ClaimStatus
        $claim_end_date: DateTimeUtc
        $programId: ID
        $rebateReports: [ClaimRebateReportsRelationInput]
        $claimTemplateRelationInput: ClaimTemplateRelation
        $excludeActionRequired: Boolean
    ) {
        updateClaim(
            id: $id
            input: {
                claim_type: $claim_type
                claim_start_date: $claim_start_date
                total_payment_rebate: $total_payment_rebate
                status: $status
                claim_end_date: $claim_end_date
                program: { connect: $programId }
                claim_template: $claimTemplateRelationInput
                rebateReports: { syncWithoutDetaching: $rebateReports }
            }
        ) {
            ...claimNodeFields
        }
    }
`;

export const UPDATE_CLAIM_TOTAL_MANUAL_OVERWRITE = gql`
    mutation updateClaim($id: ID!, $total_manual_set: Boolean, $report_total: Float, $overwrite_note: String) {
        updateClaim(
            id: $id
            input: { total_manual_set: $total_manual_set, report_total: $report_total, overwrite_note: $overwrite_note }
        ) {
            id
            total_manual_set
            report_total
            overwrite_note
        }
    }
`;

export const UPDATE_CLAIM_TOTAL_MANUAL_BUILDER_OVERWRITE = gql`
    mutation updateClaim(
        $id: ID!
        $builderId: Int!
        $builderOverwrite: Float
        $builderOverwriteFlat: Float
        $bbgOverwrite: Float
        $note: String
    ) {
        updateClaim(
            id: $id
            input: {
                factoryClaimsBuilderOverwrite: {
                    syncWithoutDetaching: [
                        {
                            id: $builderId
                            overwrite: $builderOverwrite
                            builder_overwrite: $builderOverwriteFlat
                            bbg_overwrite: $bbgOverwrite
                            note: $note
                        }
                    ]
                }
            }
        ) {
            id
            report_total
            factoryClaimsBuilderOverwrite(first: 10) {
                edges {
                    node {
                        id
                        factoryClaimsBuilderOverwritePivot {
                            builder_overwrite
                            bbg_overwrite
                            builder_allocation
                            total_allocation
                            note
                        }
                    }
                }
            }
            calculateCurrentTotal {
                total
                builderTotals {
                    builder_id
                    name
                    builder_tier
                    builder_allocation
                    total
                    factory_overwrite {
                        id
                        builder_id
                        note
                        overwrite
                        total_allocation
                        builder_allocation
                        bbg_overwrite
                        builder_overwrite
                    }
                }
            }
        }
    }
`;

export const REMOVE_CLAIM_TOTAL_MANUAL_BUILDER_OVERWRITE = gql`
    mutation updateClaim($id: ID!, $builderId: [ID]) {
        updateClaim(id: $id, input: { factoryClaimsBuilderOverwrite: { disconnect: $builderId } }) {
            id
            report_total
            calculateCurrentTotal {
                total
                builderTotals {
                    builder_id
                    name
                    builder_tier
                    builder_allocation
                    total
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
        }
    }
`;

export const READY_TO_SUBMITTED_CLAIM_UPDATE = gql`
    mutation updateClaim($id: ID!, $rebateReports: [ClaimRebateReportsRelationInput]) {
        updateClaim(id: $id, input: { rebateReports: { syncWithoutDetaching: $rebateReports } }) {
            id
            report_total
            buildersWithOpenRebateBeforeEndDate(excludeActionRequired: false) {
                id
                name
                rebateReports {
                    id
                    NeedActionHousesMissingCoCount
                    NeedActionHousesMissingAddressCount
                    ReadiedHouses {
                        model {
                            id
                            lot_number
                            address
                            address2
                            project_number
                            model
                        }
                        pivots {
                            id
                            product_quantity
                            houseProgramCount
                            requireFieldStatusPerHouse {
                                brand_correct
                                serial_number_correct
                                model_number_correct
                                date_of_installation_correct
                                date_of_purchase_correct
                                distributor_correct
                                certificate_occupancy_correct
                            }
                            products {
                                id
                                category {
                                    id
                                    name
                                }
                                require_quantity_reporting
                                programs {
                                    id
                                    name
                                }
                                minimum_unit
                                name
                                bbg_product_code
                            }
                        }
                    }
                    NeedActionHousesWithCoAndAddress {
                        model {
                            id
                            lot_number
                            address
                            address2
                            project_number
                            model
                        }
                        pivots {
                            id
                            product_quantity
                            requireFieldStatusPerHouse {
                                brand_correct
                                serial_number_correct
                                model_number_correct
                                date_of_installation_correct
                                date_of_purchase_correct
                                distributor_correct
                                certificate_occupancy_correct
                            }
                            products {
                                minimum_unit
                                id
                                category {
                                    id
                                }
                                name
                                bbg_product_code
                            }
                        }
                    }
                }
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
        }
    }
`;

export const CALCULATE_CLAIM_ALLOCATION = gql`
    ${allocationClaimNode}
    mutation calculateIndividualBuilderClaimAllocation($id: ID!, $closing: Boolean, $builderId: ID!) {
        calculateIndividualBuilderClaimAllocation(id: $id, closing: $closing, builderId: $builderId) {
            ...claimAllocationFields
        }
    }
`;

export const EDIT_BUILDER_UPDATE_CLAIM = gql`
    mutation updateClaim($id: ID!, $rebateReports: [ID]) {
        updateClaim(id: $id, input: { rebateReports: { disconnect: $rebateReports } }) {
            id
            buildersWithOpenRebateBeforeEndDate(excludeActionRequired: false) {
                id
                name
                rebateReports {
                    id
                    NeedActionHousesMissingCoCount
                    NeedActionHousesMissingAddressCount
                    ReadiedHouses {
                        model {
                            id
                            lot_number
                            address
                            address2
                            project_number
                            model
                        }
                        pivots {
                            id
                            product_quantity
                            houseProgramCount
                            requireFieldStatusPerHouse {
                                brand_correct
                                serial_number_correct
                                model_number_correct
                                date_of_installation_correct
                                date_of_purchase_correct
                                distributor_correct
                                certificate_occupancy_correct
                            }
                            products {
                                id
                                category {
                                    id
                                    name
                                }
                                require_quantity_reporting
                                programs {
                                    id
                                    name
                                }
                                minimum_unit
                                name
                                bbg_product_code
                            }
                        }
                    }
                    NeedActionHousesWithCoAndAddress {
                        model {
                            id
                            lot_number
                            address
                            address2
                            project_number
                            model
                        }
                        pivots {
                            id
                            product_quantity
                            requireFieldStatusPerHouse {
                                brand_correct
                                serial_number_correct
                                model_number_correct
                                date_of_installation_correct
                                date_of_purchase_correct
                                distributor_correct
                                certificate_occupancy_correct
                            }
                            products {
                                minimum_unit
                                id
                                category {
                                    id
                                }
                                name
                                bbg_product_code
                            }
                        }
                    }
                }
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
        }
    }
`;

export const UPDATE_VOLUME_CLAIM = gql`
    ${claimNode}
    mutation updateClaim(
        $id: ID!
        $volumeBuilders: [volumeClaimsBuilderRebatesRelationInput]
        $excludeActionRequired: Boolean
    ) {
        updateClaim(id: $id, input: { volumeClaimsBuilderRebates: { syncWithoutDetaching: $volumeBuilders } }) {
            ...claimNodeFields
        }
    }
`;

export const UPDATE_CLAIM_READY = gql`
    ${claimNode}
    mutation updateClaim($id: ID!, $status: ClaimStatus, $excludeActionRequired: Boolean) {
        updateClaim(id: $id, input: { status: $status }) {
            ...claimNodeFields
        }
    }
`;

export const ASSIGN_ALL_BUILDERS = gql`
    mutation allocateRebatesToClaim($id: ID!, $rebatesIds: [ID!]!) {
        allocateRebatesToClaim(claim_id: $id, rebate_ids: $rebatesIds) {
            id
        }
    }
`;

export const FETCH_CONVERSION_REVENUE_WITH_PROGRAM_ID = gql`
    query conversionRevenue($id: ID!) {
        conversionRevenue(input: { program_id: $id }) {
            program {
                id
                name
            }
            yearTotal {
                year
                total
            }
            quarterly {
                displayName
                quarter
                start
                end
                total
            }
        }

        paymentsDue(input: { program_id: $id }) {
            conversionPaymentDue {
                program {
                    id
                    name
                }
                due_date
                conversion {
                    __typename
                    ... on ConversionByActivity {
                        name
                    }
                    ... on ConversionFlatPayment {
                        name
                    }
                    ... on ConversionFlatPercent {
                        name
                    }
                    ... on ConversionTieredPercent {
                        name
                        tiers(first: 20) {
                            edges {
                                node {
                                    id
                                    note
                                    bonus_amount
                                    spend_exceed
                                }
                            }
                        }
                    }
                }
                payment_owed
            }
        }

        increasedRebatesEarned(input: { program_id: $id }) {
            conversion {
                __typename
                ... on ConversionByActivity {
                    name
                }
                ... on ConversionFlatPayment {
                    name
                }
                ... on ConversionFlatPercent {
                    name
                }
                ... on ConversionTieredPercent {
                    name
                    tiers(first: 20) {
                        edges {
                            node {
                                id
                                note
                                bonus_amount
                                spend_exceed
                            }
                        }
                    }
                }
            }
            program {
                id
                name
            }
            increase {
                residential
                multi_unit
                commercial
            }
            date_achieved
        }
    }
`;

export const FETCH_CONVERSION_REVENUE_WITHOUT_PROGRAM_ID = gql`
    query conversionRevenue {
        conversionRevenue {
            program {
                id
                name
            }
            yearTotal {
                year
                total
            }
            quarterly {
                displayName
                quarter
                start
                end
                total
            }
        }

        paymentsDue {
            conversionPaymentDue {
                program {
                    id
                    name
                }
                due_date
                conversion {
                    __typename
                    ... on ConversionTieredPercent {
                        name
                        tiers(first: 20) {
                            edges {
                                node {
                                    id
                                    note
                                    bonus_amount
                                    spend_exceed
                                }
                            }
                        }
                    }
                }
                payment_owed
            }
        }

        increasedRebatesEarned {
            conversion {
                __typename
            }
            program {
                id
                name
            }
            increase {
                residential
                multi_unit
                commercial
            }
            date_achieved
        }
    }
`;

export const UPSERT_DISPUTE = gql`
    mutation batchUpsertDispute($disputes: [UpdateDisputeInput]) {
        batchUpsertDispute(disputes: $disputes) {
            id
            new_product_quantity
            note
        }
    }
`;

export const BATCH_CORRECTION = gql`
    mutation batchCorrection(
        $rebates: [ID]
        $action: batchCorrectionAction!
        $qty: Int
        $newProduct: ID
        $org_id: ID!
    ) {
        batchCorrection(
            org_id: $org_id
            rebates: $rebates
            input: { action: $action, qty: $qty, newProduct: $newProduct }
        ) {
            id
        }
    }
`;

export const GET_PERIODS_LIST = gql`
    query getPeriodsListFromClaims($ids: [ID]) {
        getPeriodsListFromClaims(ids: $ids) {
            claim_start_date
            claim_end_date
        }
    }
`;

export const GET_PROPERTIES_FOR_BATCH_CORRECTION = gql`
    query getPropertyForBatchCorrection($orgId: ID!, $productId: ID!, $startDate: Date, $endDate: Date) {
        getPropertyForBatchCorrection(orgId: $orgId, productId: $productId, startDate: $startDate, endDate: $endDate) {
            id
            name
            houses {
                rebate {
                    id
                }
                house {
                    id
                    address
                    project_number
                    lot_number
                    model
                    confirmed_occupancy
                    subdivision {
                        name
                        id
                    }
                }
            }
        }
    }
`;

export const DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY = gql`
    query allocationCsv($year: Int!, $quarter: Int!, $claimId: ID) {
        factoryAllocationCsv(year: $year, quarter: $quarter, claimId: $claimId) {
            main
            overwrite
        }
    }
`;

export const DOWNLOAD_CLOSE_PERIOD_QUERY_FACTORY_CLAIM_ID_ONLY = gql`
    query allocationCsv($claimId: ID) {
        factoryAllocationCsvClaimOnly(claimId: $claimId) {
            main
            overwrite
        }
    }
`;

export const DOWNLOAD_ADDRESS_CSV = gql`
    query addressesCSV($programType: ProgramType, $quarter: Int, $year: Int, $subdivisionName: String) {
        addressesCSV(programType: $programType, quarter: $quarter, year: $year, subdivisionName: $subdivisionName) {
            custom
            regular
        }
    }
`;

export const DOWNLOAD_CLOSE_PERIOD_QUERY = gql`
    query allocationCsv($year: Int!, $quarter: Int!, $claimId: ID) {
        factoryAllocationCsv(year: $year, quarter: $quarter, claimId: $claimId) {
            main
            overwrite
        }
        volumeAllocationCsv(year: $year, quarter: $quarter, claimId: $claimId)
    }
`;

export const DOWNLOAD_CLOSE_PERIOD_QUERY_VOLUME = gql`
    query allocationCsv($year: Int!, $quarter: Int!, $claimId: ID) {
        volumeAllocationCsv(year: $year, quarter: $quarter, claimId: $claimId)
    }
`;

export const SEARCH_ELIGIBLE_BUILDER = gql`
    query searchEligibleBuilder($id: ID!, $search: String!) {
        searchEligibleBuilder(program_id: $id, search: $search, first: 200) {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_BUILDER_REBATES = gql`
    query ProductsFromOrganization($orgId: ID!) {
        ProductsFromOrganization(org_id: $orgId) {
            id
        }
    }
`;

export const GET_UNAVAILABLE_REBATES = gql`
    query getUnavailableRebates {
        getUnavailableRebates
    }
`;
