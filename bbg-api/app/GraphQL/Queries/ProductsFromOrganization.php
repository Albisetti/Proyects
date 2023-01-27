<?php

namespace App\GraphQL\Queries;

use App\Models\Products;
use App\Models\RebateReportsHousesProducts;
use Illuminate\Support\Facades\DB;

class ProductsFromOrganization
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        if ( isset( $args['org_id'] ) ) {
            $organizationId = $args['org_id'];
        } else {
            throw new \Exception('Must provide a Organization id');
        }

//        $rebatesAndProducts = RebateReportsHousesProducts::
//        whereHas('rebateReports',function($query)use($organizationId){
//            $query->where('organization_id',$organizationId);
//        })
//        ;

        $rebatesAndProducts = DB::select("
select *,
`preGottenProducts`.`id` as preGottenProductsID,
`preGottenProducts`.`name` as product_name,
`preGottenProducts`.`bbg_product_code` as bbg_product_code,
`preGottenProducts`.`description` as product_description,
`preGottenProducts`.`created_at` as product_created_at,
`preGottenProducts`.`updated_at` as product_updated_at,
`preGottenProducts`.`deleted_at` as product_deleted_at,

`product_categories`.`id` as product_categories_id,
`product_categories`.`name` as product_categories_name,

`houses`.`status` as house_status,
`houses`.`address` as house_address,
`houses`.`address2` as house_address2,
`houses`.`zip_postal` as house_zip_postal,
`houses`.`city` as house_city,
`houses`.`state_id` as house_state_id,
`houses`.`subdivision_id` as house_subdivision_id,
`houses`.`created_at` as house_created_at,
`houses`.`updated_at` as house_updated_at,
`houses`.`deleted_at` as house_deleted_at,

`subcontractor`.`id` as subcontractor_id,

`subdivisions`.`name` as subdivision_name,

`claims`.`id` as claims_id,
`claims`.`status` as claims_status,
`claims`.`deleted_at` as claims_deleted_at,
`claims`.`approved_at` as claims_approved_at,

`programs`.`name` as `program_name`,
`programs`.`internal_description` as `program_internal_description`,
`programs`.`builder_description` as `program_builder_description`,
`programs`.`builder_description_short` as `program_builder_description_short`,
`programs`.`created_at` as program_created_at,
`programs`.`updated_at` as program_updated_at,
`programs`.`deleted_at` as program_deleted_at,

`rebateReports_houses_products`.`id` as id,
`rebateReports_houses_products`.`status` as rebate_status,
`rebateReports_houses_products`.`rebateReport_id` as rebateReport_id
from `rebateReports_houses_products`
         inner join `products` as `preGottenProducts` on `preGottenProducts`.`id` = `rebateReports_houses_products`.`product_id`
         inner join `houses` as `houses` on `houses`.`id` = `rebateReports_houses_products`.`house_id`
         left join `sub_contractors` as `subcontractor` on `subcontractor`.`id` = `rebateReports_houses_products`.`subcontractor_provider_id`
         left join (
            select `claims`.`id`, `claims`.`status`, `claims`.`deleted_at`, `claim_rebateReport`.`rebateReport_id`, `claim_rebateReport`.`approved_at` from `claims` left join `claim_rebateReport` on `claim_rebateReport`.`claim_id` = `claims`.`id`
            ) as `claims` on `claims`.`rebateReport_id` = `rebateReports_houses_products`.`id`
         left join `product_categories` as `product_categories` on `product_categories`.`id` = `preGottenProducts`.`category_id`
         left join `sub_divisions` as `subdivisions` on `subdivisions`.`id` = `houses`.`subdivision_id`
         left join (
            select
                Distinct `programs`.`id` as `program_id`,
                `products_programs`.`product_id` as `program_product_id`,
                `programs`.*
            from `programs`
            join `products_programs` on `products_programs`.`program_id` = `programs`.`id`
         ) as `programs` on
            `programs`.`program_product_id` = `preGottenProducts`.`id`

where exists(select *
             from `rebateReports`
             where `rebateReports_houses_products`.`rebateReport_id` = `rebateReports`.`id`
               and `organization_id` = ".$organizationId."
               and `rebateReports`.`deleted_at` is null
               and `houses`.`deleted_at` is NULL)
order by `program_name` asc, `product_categories_name` asc, LENGTH(bbg_product_code), bbg_product_code");

//        throw new \Exception(json_encode($rebatesAndProducts));

        $returnResults = [];

        foreach ( $rebatesAndProducts as $index=>$record ){

            if( !isset( $returnResults[$record->id]) ){
                $record->programs = [];
                $record->relatedToClaim=null;
                $record->claimed=null;
                $record->isModifiable=null;
                $returnResults[$record->id] = $record;
            }

            if (
                (isset($record->program_id) && !empty($record->program_id))
                && !isset($returnResults[$record->id]->programs[$record->program_id])
            ){
                $returnResults[$record->id]->programs[$record->program_id] = [
                    'program_id'=>$record->program_id,
                    'program_name'=>$record->program_name,
                    'program_internal_description'=>$record->program_internal_description,
                    'program_builder_description'=>$record->program_builder_description,
                    'program_builder_description_short'=>$record->program_builder_description_short,
                    'lot_and_address_requirement'=>$record->lot_and_address_requirement,
                    'require_certificate_occupancy'=>$record->require_certificate_occupancy,
                    'require_brand'=>$record->require_brand,
                    'require_serial_number'=>$record->require_serial_number,
                    'require_model_number'=>$record->require_model_number,
                    'require_date_of_installation'=>$record->require_date_of_installation,
                    'require_date_of_purchase'=>$record->require_date_of_purchase,
                    'require_distributor'=>$record->require_distributor,
                    'is_flat_rebate'=>$record->is_flat_rebate,
                    'flat_builder_rebate'=>$record->flat_builder_rebate,
                    'flat_bbg_rebate'=>$record->flat_bbg_rebate,
                ];
            }

            if (
                (isset($record->claims_id) && !empty($record->claims_id))
//                && (!isset($record->claims_deleted_at) || empty($record->claims_deleted_at))
            ) {
                $returnResults[$record->id]->relatedToClaim = true;

                if( isset($record->claims_approved_at) && !empty($record->claims_approved_at) ){
                    $returnResults[$record->id]->claimed = true;
                    $returnResults[$record->id]->isModifiable = false;
                } else {
                    if ( $returnResults[$record->id]->claimed !== true )$returnResults[$record->id]->claimed = false;

                    if (
                        (isset($record->claims_status) && !empty($record->claims_status))
                        && (in_array($record->claims_status,['submitted','disputed','ready to close','close']))
                    ) {
                        $returnResults[$record->id]->isModifiable = false;
                    } else {
                        if ( $returnResults[$record->id]->isModifiable !== false ) $returnResults[$record->id]->isModifiable = true;
                    }
                }
            } else {
                if ( $returnResults[$record->id]->relatedToClaim !== true )$returnResults[$record->id]->relatedToClaim = false;
                if ( $returnResults[$record->id]->claimed !== true )$returnResults[$record->id]->claimed = false;
                if ( $returnResults[$record->id]->isModifiable !== false ) $returnResults[$record->id]->isModifiable = true;
            }
        }

        return $returnResults;
    }
}
