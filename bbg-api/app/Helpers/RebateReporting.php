<?php
namespace App\Helpers;

use App\Models\Organizations;
use App\Models\Houses;
use App\Models\RebateReportsHousesProducts;

class RebateReporting {
    public static $MOCK_TIERS = [
        'founder' 	=> '100',
        'Tier 3' 	=> '60',
        'Tier 2' 	=> '50',
        'Tier 1' 	=> '40',
        'none'      => '0',
    ];

    public static function getFlatRebateAmount($program, $product, $organization_id, $organizationProgram=null,$productOverwrite=null)
    {

        if( isset($product->flat_bbg_rebate) ) {
            $bbg_amount = $product->flat_bbg_rebate;
        } else {
            if( isset($program->flat_bbg_rebate) ) {
                $bbg_amount = $program->flat_bbg_rebate;
            }
        }

        if( isset($product->flat_bbg_rebate) ) {
            $builder_amount = $product->flat_builder_rebate;
        } else {
            if( isset($program->flat_bbg_rebate) ) {
                $builder_amount = $program->flat_builder_rebate;
            }
        }

        if (
            $organizationProgram !== null &&
            $organizationProgram &&
            isset($organizationProgram->pivot) &&
            $organizationProgram->pivot->overwrite_amount_type === 'amount'
            && (
                isset($organizationProgram->pivot->flat_bbg_overwrite)
                && isset($organizationProgram->pivot->flat_builder_overwrite)
                )
        ){
            $bbg_amount = $organizationProgram->pivot->flat_bbg_overwrite;
            $builder_amount = $organizationProgram->pivot->flat_builder_overwrite;
        }

        if(
            $productOverwrite !== null
            && $productOverwrite
            && (
                //Overwrite would either have 3 number if existing or 3 null
                isset($productOverwrite->flat_bbg_overwrite)
                && isset($productOverwrite->flat_builder_overwrite)
            )
        ){
            $bbg_amount = $productOverwrite->flat_bbg_overwrite;
            $builder_amount = $productOverwrite->flat_builder_overwrite;

        }

        if (
            ($product->customization_id !== null && $product->customization_id == $organization_id)
        ) {
            $bbg_amount = ( isset($product->flat_bbg_rebate) ? $product->flat_bbg_rebate : 0 );
            $builder_amount = ( isset($product->flat_builder_rebate) ? $product->flat_builder_rebate : 0 );
        }

        if ( isset($bbg_amount) && isset($builder_amount) ) {
            return [
                'bbg_amount' => $bbg_amount,
                'builder_amount' => $builder_amount
            ];
        }

        return null;
    }

	public static function factoryRebateAllocations($program, $product, $rebateHouseProduct, &$conversions = [])
    {
        $MOCK_TIERS = [
            'founder' => '100',
            'Tier 3' => '60',
            'Tier 2' => '50',
            'Tier 1' => '40',
            'none' => '0',
        ];

        //TODO: check for existing?
        $rebateReport = $rebateHouseProduct->rebateReports;
        $organization = $rebateReport->organization;
        $house = $rebateHouseProduct->houses;
        $property_type = $house->property_type;
        $tier = $organization->member_tier;

        $overwrite = false;

        /* The base rebate values are initially the same. */

        $product_rebate_amount_type = $product->rebate_amount_type;
        $base_rebate_amount = 0;

        switch ($property_type) {
            case 'residential':
                $original_base_rebate_amount = $product->residential_rebate_amount;
                $base_rebate_amount = $product->residential_rebate_amount;
                break;

            case 'multi-unit':
                $original_base_rebate_amount = $product->multi_unit_rebate_amount;
                $base_rebate_amount = $product->multi_unit_rebate_amount;
                break;

            case 'commercial':
                $original_base_rebate_amount = $product->commercial_rebate_amount;
                $base_rebate_amount = $product->commercial_rebate_amount;
                break;

            default:
                break;
        }

        //programs_participants table, Organization Program Overwrite
        $organizationProgram = $organization->programs->where('id', $program->id)->first();

        if (
            $organizationProgram &&
            isset($organizationProgram->pivot) &&
            $organizationProgram->pivot->overwrite_amount_type === 'amount'
            && (isset($organizationProgram->pivot->residential_rebate_overwrite)
            && isset($organizationProgram->pivot->multi_unit_rebate_overwrite)
            && isset($organizationProgram->pivot->commercial_rebate_overwrite))
        ){
            //Overwrite would either have 3 number if existing or 3 null

            switch ($property_type) {
                case 'residential':
                    if (isset($organizationProgram->pivot->residential_rebate_overwrite)) {
                        $base_rebate_amount = $organizationProgram->pivot->residential_rebate_overwrite;
                        $program_residential_rebate_overwrite = $organizationProgram->pivot->residential_rebate_overwrite;
                        $overwrite = true;
                    }
                    break;

                case 'multi-unit':
                    if (isset($organizationProgram->pivot->multi_unit_rebate_overwrite)) {
                        $base_rebate_amount = $organizationProgram->pivot->multi_unit_rebate_overwrite;
                        $program_multi_unit_rebate_overwrite = $organizationProgram->pivot->multi_unit_rebate_overwrite;
                        $overwrite = true;
                    }
                    break;

                case 'commercial':
                    if (isset($organizationProgram->pivot->commercial_rebate_overwrite)) {
                        $base_rebate_amount = $organizationProgram->pivot->commercial_rebate_overwrite;
                        $program_commercial_rebate_overwrite = $organizationProgram->pivot->commercial_rebate_overwrite;
                        $overwrite = true;
                    }
                    break;

                default:
                    break;
            }
    }

        //See if the Product has any Organization Overwrite (organization_customProducts table) and if use those values instead
        $productOverwrites = $product->organizationOverwrites->where('id',$organization->id);
        $productOverwriteKey = $productOverwrites->search(function($item, $key)use($program){
            if(isset($item->pivot)){
                return $item->pivot->program_id == $program->id;
            }

            return false;
        });

        if(
            ($productOverwriteKey !== false && isset($productOverwrites[$productOverwriteKey]->pivot)
            && $productOverwrites[$productOverwriteKey]->pivot->overwrite_amount_type == 'amount')
            && (
                //Overwrite would either have 3 number if existing or 3 null
                isset($productOverwrites[$productOverwriteKey]->pivot->residential_rebate_overwrite)
                && isset($productOverwrites[$productOverwriteKey]->pivot->multi_unit_rebate_overwrite)
                && isset($productOverwrites[$productOverwriteKey]->pivot->commercial_rebate_overwrite)
            )
        ){
            $productOverwrite = $productOverwrites[$productOverwriteKey]->pivot;

            switch($property_type) {
                //TODO: if the overwrite for a specific type is null, default to original value or exit?
                case 'residential':
                    $base_rebate_amount = $productOverwrite->residential_rebate_overwrite;
                    $product_residential_rebate_overwrite = $productOverwrite->residential_rebate_overwrite;
                    $overwrite = true;
                    break;

                case 'multi-unit':
                    $base_rebate_amount = $productOverwrite->multi_unit_rebate_overwrite;
                    $product_multi_unit_rebate_overwrite = $productOverwrite->multi_unit_rebate_overwrite;
                    $overwrite = true;
                    break;

                case 'commercial':
                    $base_rebate_amount = $productOverwrite->commercial_rebate_overwrite;
                    $product_commercial_rebate_overwrite = $productOverwrite->commercial_rebate_overwrite;
                    $overwrite = true;
                    break;

                default:
                    break;
            }
        }

        $is_unique_product = false;
        if (
        ($product->customization_id !== null && $product->customization_id == $organization->id)
        ) {
            $is_unique_product = true;
            $base_rebate_amount = 0;
            $flatAmount = [];

            switch($property_type) {
                case 'residential':
                    $flatAmount['builder_amount'] = ( isset($product->cust_builder_residential_amount) ? $product->cust_builder_residential_amount : 0 );
                    $flatAmount['bbg_amount'] = ( isset($product->cust_bbg_residential_amount) ? $product->cust_bbg_residential_amount : 0 );
                    break;

                case 'multi-unit':
                    $flatAmount['builder_amount'] = ( isset($product->cust_builder_multi_unit_amount) ? $product->cust_builder_multi_unit_amount : 0 );
                    $flatAmount['bbg_amount'] = ( isset($product->cust_bbg_multi_unit_amount) ? $product->cust_bbg_multi_unit_amount : 0 );
                    break;

                case 'commercial':
                    $flatAmount['builder_amount'] = ( isset($product->cust_builder_commercial_amount) ? $product->cust_builder_commercial_amount : 0 );
                    $flatAmount['bbg_amount'] = ( isset($product->cust_bbg_commercial_amount) ? $product->cust_bbg_commercial_amount : 0 );
                    break;

                default:
                    break;
            }
        }

        $original_post_conversion_base_rebate_amount = $original_base_rebate_amount;

        if( $program->is_flat_rebate || $is_unique_product ){

            if($program->is_flat_rebate) { //If flat rebate replace original values with flat rebate fields
                $flatAmount = self::getFlatRebateAmount(
                    $program,
                    $product,
                    $organization->id,
                    ($organizationProgram ? $organizationProgram : null),
                    (
                    ($productOverwriteKey !== false && isset($productOverwrites[$productOverwriteKey]->pivot)
                        && $productOverwrites[$productOverwriteKey]->pivot->overwrite_amount_type == 'amount')
                    && (
                        isset($productOverwrites[$productOverwriteKey]->pivot->flat_builder_overwrite)
                        && isset($productOverwrites[$productOverwriteKey]->pivot->flat_bbg_overwrite)
                    )

                        ? $productOverwrites[$productOverwriteKey]->pivot : null)
                );
            }

            if( isset($flatAmount) ){
                $post_conversion_base_rebate_amount = ($flatAmount['bbg_amount'] + $flatAmount['builder_amount']);
            } else {
                $post_conversion_base_rebate_amount = $base_rebate_amount;
            }
        } else {
            $post_conversion_base_rebate_amount = $base_rebate_amount;
        }

        $original_post_conversion_base_rebate_amount = (isset($original_base_rebate_amount)?$original_base_rebate_amount:0);

        foreach($conversions['conversions_applied'] as &$conversion) {
			if($conversion['conversion_type'] === 'tiered_percentages') {
				continue;
			}

			switch($conversion['bonus_type']) {
				case 'rebate_per_unit':
					$post_conversion_base_rebate_amount += $conversion['bonus_amount'];
                    if(isset($original_post_conversion_base_rebate_amount)) $original_post_conversion_base_rebate_amount += $conversion['bonus_amount'];
					break;
			}
		}

        if( $program->is_flat_rebate || $is_unique_product ){
            if( isset($flatAmount) ){
                $conversion_base_difference = $post_conversion_base_rebate_amount - ($flatAmount['bbg_amount'] + $flatAmount['builder_amount']);
            } else {
                $conversion_base_difference = $post_conversion_base_rebate_amount - $base_rebate_amount;
            }
        } else {
            $conversion_base_difference = $post_conversion_base_rebate_amount - $base_rebate_amount;
        }

        $product_qty = $rebateHouseProduct->product_quantity;

        if($rebateHouseProduct && (isset($rebateHouseProduct->dispute) && !empty($rebateHouseProduct->dispute)) ) {
            //TODO:: Need to confirm Overwrites
            $disputeResults = self::disputeAllocation($rebateHouseProduct, $property_type, $product, $organization, $tier, $program, $base_rebate_amount,$post_conversion_base_rebate_amount, (isset($original_base_rebate_amount)?$original_base_rebate_amount:0), (isset($overwrite)?$overwrite:false),(isset($flatAmount)?$flatAmount:null),(isset($is_unique_product)?$is_unique_product:false),(isset($original_post_conversion_base_rebate_amount)?$original_post_conversion_base_rebate_amount:null));

            if($program->bbg_rebate_unit === "Per Unit") {
                $dispute = $rebateHouseProduct->dispute; //TODO: latest
                $product_dispute_qty = $dispute->new_product_quantity;
                $conversions['total'] += $conversion_base_difference * $product_dispute_qty;
            } else {
                $dispute = $rebateHouseProduct->dispute; //TODO: latest
                $conversions['total'] += $conversion_base_difference;
            }

        } else {
            if($program->bbg_rebate_unit === "Per Unit") {
                $conversions['total'] += $conversion_base_difference * $product_qty;
            } else {
                $conversions['total'] += $conversion_base_difference;
            }
        }

        $builder_rebate = $base_rebate_amount;

        if($program->bbg_rebate_unit === "Per Unit") {
            $post_conversion_base_rebate_amount *= $product_qty;
            if(isset($original_post_conversion_base_rebate_amount)) $original_post_conversion_base_rebate_amount *= $product_qty;
            $base_rebate_amount *= $product_qty;
            $builder_rebate *= $product_qty;
        } else {
//            $unique_property_installations = RebateReportsHousesProducts::where('rebateReport_id', $rebateReport->id)
//                ->where('product_id', $product->id)
//                ->whereIn('status', ['rebate ready', 'completed'])
//                ->count();//TODO: could be optimized?

//				$post_conversion_base_rebate_amount *= $unique_property_installations;
//				$base_rebate_amount *= $unique_property_installations;
//				$builder_rebate *= $unique_property_installations;
        }

        if(!$overwrite){
            $tier_rebate = $builder_rebate * ($MOCK_TIERS[$tier] / 100);
            $bbg_keeps = $post_conversion_base_rebate_amount - $tier_rebate;
        } else {
            $tier_rebate = $builder_rebate;
            $original_tier_rebate = $original_base_rebate_amount * ($MOCK_TIERS[$tier] / 100);
            $original_bbg_keeps = $original_post_conversion_base_rebate_amount - $original_tier_rebate;
            $bbg_keeps = $original_post_conversion_base_rebate_amount - $tier_rebate;
        }

        if( $program->is_flat_rebate || $is_unique_product ){
            if( isset($flatAmount) ){
                $tier_rebate = $flatAmount['builder_amount'];
                $bbg_keeps = $flatAmount['bbg_amount'];
                if($program->bbg_rebate_unit === "Per Unit") {
                    $tier_rebate *= $product_qty;
                    $bbg_keeps *= $product_qty;
                }
                $base_rebate_amount = $bbg_keeps + $tier_rebate;
            }
        }

        $result = [
            "organization_id" => $organization->id,
            "member_tier" => $tier,
            "member_tier_percent" => $MOCK_TIERS[$tier],

            "program_is_flat_amount" => $program->is_flat_rebate,
            "program_rebate_unit" => $program->bbg_rebate_unit,
            "report_product_quantity" => $product_qty,

            "property_type" => $property_type,
            "program_id" => $program->id,
            "program_type" => $program->type,

            "original_residential_rebate_amount" => $product->residential_rebate_amount,
            "original_multiUnit_rebate_amount" => $product->multi_unit_rebate_amount,
            "original_commercial_rebate_amount" => $product->rcommercial_rebate_amount,

            "post_conversion_base_rebate_amount" => $post_conversion_base_rebate_amount,//TODO: is this used anywhere? If so need to take into account flat rebate?

        ];

        //Original Values
            if(isset($original_bbg_keeps))$result["original_bbg_keeps"] = $original_bbg_keeps;
            if(isset($original_bbg_keeps) && isset($original_tier_rebate))$result["original_base_rebate_amount"] = ($original_tier_rebate+$original_bbg_keeps);
            if(isset($original_tier_rebate))$result["original_builder_keeps"] = $original_tier_rebate;

        //Organization's Program Overwrite Root Values
        if(isset($program_residential_rebate_overwrite))$result["program_residential_rebate_overwrite"] = $program_residential_rebate_overwrite;
        if(isset($program_multi_unit_rebate_overwrite))$result["program_multi_unit_rebate_overwrite"] = $program_multi_unit_rebate_overwrite;
        if(isset($program_commercial_rebate_overwrite))$result["program_commercial_rebate_overwrite"] = $program_commercial_rebate_overwrite;

        //Organization's Product Overwrite Root Values
        if(isset($product_residential_rebate_overwrite))$result["product_residential_rebate_overwrite"] = $product_residential_rebate_overwrite;
        if(isset($product_multi_unit_rebate_overwrite))$result["product_multi_unit_rebate_overwrite"] = $product_multi_unit_rebate_overwrite;
        if(isset($product_commercial_rebate_overwrite))$result["product_commercial_rebate_overwrite"] = $product_commercial_rebate_overwrite;

        //Product Customization
        if(isset($product->cust_builder_residential_amount))$result["cust_builder_residential_amount"] = $product->cust_builder_residential_amount;
        if(isset($product->cust_bbg_residential_amount))$result["cust_bbg_residential_amount"] = $product->cust_bbg_residential_amount;
        if(isset($product->cust_builder_multi_unit_amount))$result["cust_builder_multi_unit_amount"] = $product->cust_builder_multi_unit_amount;
        if(isset($product->cust_bbg_multi_unit_amount))$result["cust_bbg_multi_unit_amount"] = $product->cust_bbg_multi_unit_amount;
        if(isset($product->cust_builder_commercial_amount))$result["cust_builder_commercial_amount"] = $product->cust_builder_commercial_amount;
        if(isset($product->cust_bbg_commercial_amount))$result["cust_bbg_commercial_amount"] = $product->cust_bbg_commercial_amount;

        if(isset($flatAmount)) $result["flat_rebate"] = $flatAmount;

        //Calculations Results
        $result["bbg_keeps"] = ($bbg_keeps<=0?0:$bbg_keeps);
        $result["base_rebate_amount"] = ($bbg_keeps<=0?0:$bbg_keeps)+$tier_rebate;
        $result["builder_keeps"] = $tier_rebate;

        if( isset($disputeResults) ){
            $result['dispute'] = $disputeResults;
        }

        return $result;
	}

    /**
     * @param $rebateReportHouseProduct
     * @param $property_type
     * @param $product
     * @param $organization
     * @param $tier
     * @param $program
     * @param $base_rebate_amount
     * @param $post_conversion_base_rebate_amount
     * @param null $flatAmount
     * @return array|null
     */
    protected static function disputeAllocation($rebateReportHouseProduct, $property_type, $product, $organization, $tier, $program, $base_rebate_amount, $post_conversion_base_rebate_amount, $original_base_rebate_amount, $overwrite = false, $flatAmount = null, $is_unique_product = false, $original_post_conversion_base_rebate_amount = null)
    {
        $dispute = $rebateReportHouseProduct->dispute; //hasOne relation
        $product_dispute_qty = $dispute->new_product_quantity;

        /* This product doesn't have special builder pricing. */
        $builder_rebate = $base_rebate_amount;

        if($program->bbg_rebate_unit === "Per Unit") {
            $post_conversion_base_rebate_amount *= $product_dispute_qty;
            if(isset($original_post_conversion_base_rebate_amount)) $original_post_conversion_base_rebate_amount *= $product_dispute_qty;
            $base_rebate_amount *= $product_dispute_qty;
            $builder_rebate *= $product_dispute_qty;
        } else {
//            $unique_property_installations = RebateReportsHousesProducts::where('id', $rebateReportHouseProduct->rebateReports->id)
//                ->where('product_id', $product->id)
//                ->whereIn('status', ['rebate ready', 'completed'])
//                ->count(); //TODO: optimize?

//                $post_conversion_base_rebate_amount *= $unique_property_installations;
//                $base_rebate_amount *= $unique_property_installations;
//                $builder_rebate *= $unique_property_installations;
        }

        if(!$overwrite){
            $tier_rebate = $builder_rebate * (self::$MOCK_TIERS[$tier] / 100);
            $bbg_keeps = $post_conversion_base_rebate_amount - $tier_rebate;
        } else {
            $tier_rebate = $builder_rebate;
            $original_tier_rebate = $original_base_rebate_amount * (self::$MOCK_TIERS[$tier] / 100);
            $original_bbg_keeps = $original_post_conversion_base_rebate_amount - $original_tier_rebate;
            $bbg_keeps = $original_post_conversion_base_rebate_amount - $tier_rebate;
        }

        if( $program->is_flat_rebate || $is_unique_product ){
            if( isset($flatAmount) ){
                $tier_rebate =$flatAmount['builder_amount'];
                $bbg_keeps = $flatAmount['bbg_amount'];
                if($program->bbg_rebate_unit === "Per Unit") {
                    $tier_rebate *= $product_dispute_qty;
                    $bbg_keeps *= $product_dispute_qty;
                }

                $base_rebate_amount = $bbg_keeps + $tier_rebate;
            }
        }
        $result = [
            "dispute_ID" =>$dispute->id,
            "RRHP_ID" =>$rebateReportHouseProduct->id,

            "organization_id" => $organization->id,
            "member_tier" => $tier,

            "program_rebate_unit" => $program->bbg_rebate_unit,
            "dispute QTY" => $product_dispute_qty,

            "property_type" => $property_type,
            "program_id" => $program->id,
            "program_type" => $program->type,

            "post_conversion_base_rebate_amount" => $post_conversion_base_rebate_amount,
        ];

        //Original Values
        if(isset($original_bbg_keeps))$result["original_bbg_keeps"] = $original_bbg_keeps;
        if(isset($original_bbg_keeps) && isset($original_tier_rebate))$result["original_base_rebate_amount"] = ($original_tier_rebate+$original_bbg_keeps);
        if(isset($original_tier_rebate))$result["original_builder_keeps"] = $original_tier_rebate;

        if(isset($flatAmount)) $result["flat_rebate"] = $flatAmount;

        //Calculations Results
        $result["bbg_keeps"] = ($bbg_keeps<=0?0:$bbg_keeps);
        $result["base_rebate_amount"] = ($bbg_keeps<=0?0:$bbg_keeps)+$tier_rebate;
        $result["builder_keeps"] = $tier_rebate;

        return $result;
    }
}
