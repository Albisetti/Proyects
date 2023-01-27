# Rules Allocation Engine

## Overview

- A subsystem for calculating rebate revenue distribution

## Glossary

- **Builder**: `organization` where `organization_type = BUILDERS`

- **Participant**: relationship between a program and a builder (`programs_participants`)

- **Rebate**: the house-product relation of a builder (`rebateReports_houses_products`)

## Helpers

**TODO: this is now outdated; revise with latest iteration of RAE helpers**

Under the `App\Helpers\RulesAllocationEngine` class, a series of static helper methods allow the
application to share a common facility for arriving at critical values to be used throughout the BBG 
software.

| Method  | Inputs | Outputs |
|---|---|---|
`calculateFactoryClaimAllocations` | rebates of a builder | rebate amount, builder allocations
`calculateVolumeClaimAllocations` | flat rebate value | rebate amount, builder allocations |

\* *BBG amount = rebate amount - builder allocations*

## Models and necessary data points

- **Builders**
  - `member_tier`: `ENUM('NONE', 'GOLD', 'SILVER', 'BRONZE', 'FOUNDER')`
- **Programs**
  - **Conversions**:
    - flat payment: `ConversionFlatPayment`, `conversionFlatPayment`
    - flat percent: `ConversionFlatPercent`, `conversionFlatPercent`
    - tier percent: `ConversionTieredPercent`, `conversionTierPercent`
      - hasMany children: `ConversionTieredPercentTier`, `conversionTiered_tier` 
        - bonus amount and spend exceed
    - by activity: `ConversionByActivity`, `conversionByActivity`
        - by product quantity: *sometimes* it has a product relationship:  `conversionByActivity_products`
  - **Claim templates**: 
    - on programs as a field: `volume_bbg_rebate`
    - on participant pivot fields: 
      - `volume_bbg_rebate`, 
      - `overwrite_amount_type = ENUM('PERCENTAGE', AMOUNT', 'TIER')`
      - `residential_rebate_overwrite`
      - `multi_unit_rebate_overwrite`
      - `commercial_rebate_overwrite`
    - on program-product (`products_programs`, a belongs-to-many relationship between products and programs) pivot fields:
      - `volume_bbg_rebate`
    - on program-builder-product `organization_customProducts` with pivot fields:
      - `organization_id`, `program_id`, `product_id` for identifying specific overwrites on that product
      - `volume_bbg_rebate`
      - `overwrite_amount_type = ENUM('PERCENTAGE', AMOUNT', 'TIER')`
      - `residential_rebate_overwrite`
      - `multi_unit_rebate_overwrite`
      - `commercial_rebate_overwrite`
 - **Claims** are connected to **rebates** by relation `claim_rebateReport` and on this relation: 
   - `rebate_adjusted` used in conjunction with builders' `member_tier` used to calculate and return allocations
