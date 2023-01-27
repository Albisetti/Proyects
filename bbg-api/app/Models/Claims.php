<?php

namespace App\Models;

use App\Events\ClaimPeriodClose;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Laravel\Scout\Searchable;

class Claims extends Model
{
    use HasFactory;
    use Searchable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'is_template',
        'claim_type',
        'organization_id',
        'name',
        'claim_start_date',
        'claim_end_date',
        'claim_total_bbg',
        'claim_total_builders',
        'status',
        'volume_total_bbg',
        'volume_total_builder',
        'rebate_total_bbg',
        'rebate_total_builder',
        'paid_total',
        'amount_owed_bbg',
        'amount_owed_builder',
        'claim_paid_bbg',
        'claim_paid_builder',
        'lost_disbute_bbg',
        'lost_disbute_builder',
        'lost_type',
        'lost_description',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'total_payment_rebate',
        'report_total',
        'report_year',
        'report_quarter',
        'claim_template_product_id',
    ];

    public function volumeClaimsBuilderRebates(): BelongsToMany
    {
        return $this->belongsToMany(Organizations::class, 'volumeClaims_builders','volumeClaim_id','builder_id')
            ->using(VolumeClaimsBuilders::class)
            ->withPivot(
                'id',
                'builder_id',
                'volumeClaim_id',
                'rebate_earned',
                'rebate_adjusted',
                'builder_allocation',
                'total_allocation',
                'note',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at',
                'approved_at'
            );
    }

    public function buildersWithOpenRebateBeforeEndDateOld( $excludeActionRequired = false ) {
        $program_id = $this->program_id;
        $product_type = $this->claim_template_product_type;
        $product_id = $this->claim_template_product_id;
        $organizations = collect([]);

//        if(isset($this->claim_end_date)){
            $rebates = RebateReportsHousesProducts::
//            whereDate('created_at', '<=',$this->claim_end_date)->
                with(['rebateReports','products'])
//            ->get()
            ;

            if($excludeActionRequired) {
                $rebates->whereNotIn('status',['action required','completed']);
            } else {
                $rebates->whereNotIn('status',['completed']);
            }
//
            $rebates = $rebates->get();
            foreach ( $rebates as $rebate ){
                if (isset($product_type) && isset($product_id)&&!empty($rebate->products)){
                    if( $product_type === "App\\Models\\OrganizationCustomProduct" ) {
                        if(
                        OrganizationCustomProduct::where('program_id',$program_id)
                            ->where('product_id',$rebate->products->id)
                            ->where('product_id',$product_id)
                            ->exists()
                        )
                        {
                            $organizations = $organizations->merge($rebate->rebateReports->organization()->get());
                            break;
                        }
                    } elseif ( $product_type === "App\\Models\\ProductsPrograms" ) {
                        if(
                        ProductsPrograms::where('program_id',$program_id)
                            ->where('product_id',$rebate->products->id)
                            ->where('product_id',$product_id)
                            ->exists()
                        )
                        {
                            $organizations = $organizations->merge($rebate->rebateReports->organization()->get());
                            break;
                        }
                    }
                } else {
                    if( isset($rebate->products) && $rebate->products->programs->contains('id',$program_id)) {
                        $organizations = $organizations->merge($rebate->rebateReports->organization()->get());
                        break;
                    }
                }
            }
//        }

        $currentClaimsRebate = $this->rebateReports()->with(['rebateReports.organization'])->get()->pluck('rebateReports.organization')->flatten()->unique(); //todo: would remove all builders, even half completed

        foreach ($organizations as $key=>$organization){
            if( $currentClaimsRebate->contains('id',$organization->id )){
                $organizations->forget($key);
            }
        }
        $organizations = $organizations->unique('id');
        return $organizations;
    }

    public function buildersWithOpenRebateBeforeEndDate( $excludeActionRequired = false ) {

        //Needed because lighthouse make this null, when not set
        if(!isset($excludeActionRequired))$excludeActionRequired=false;

        $program_id = $this->program_id;
        $product_type = $this->claim_template_product_type;
        $product_id = $this->claim_template_product_id;
        $organizations = [];

$selectStatement = "
select *,
`preGottenProducts`.`id`                          as preGottenProductsID,
`preGottenProducts`.`name`                        as product_name,
`preGottenProducts`.`description`                 as product_description,
`preGottenProducts`.`created_at`                  as product_created_at,
`preGottenProducts`.`updated_at`                  as product_updated_at,
`preGottenProducts`.`deleted_at`                  as product_deleted_at,

`product_categories`.`id`                         as product_categories_id,
`product_categories`.`name`                       as product_categories_name,

`houses`.`status`                                 as house_status,
`houses`.`address`                                as house_address,
`houses`.`address2`                               as house_address2,
`houses`.`zip_postal`                             as house_zip_postal,
`houses`.`city`                                   as house_city,
`houses`.`state_id`                               as house_state_id,
`houses`.`subdivision_id`                         as house_subdivision_id,
`houses`.`created_at`                             as house_created_at,
`houses`.`updated_at`                             as house_updated_at,
`houses`.`deleted_at`                             as house_deleted_at,

`subcontractor`.`id`                              as subcontractor_id,

`subdivisions`.`name`                             as subdivision_name,

`claims`.`id`                                     as claims_id,
`claims`.`status`                                 as claims_status,
`claims`.`deleted_at`                             as claims_deleted_at,
`claims`.`approved_at`                            as claims_approved_at,

`programs`.`id`                                   as `program_id`,
`programs`.`name`                                 as `program_name`,
`programs`.`internal_description`                 as `program_internal_description`,
`programs`.`builder_description`                  as `program_builder_description`,
`programs`.`builder_description_short`            as `program_builder_description_short`,
`programs`.`created_at`                           as program_created_at,
`programs`.`updated_at`                           as program_updated_at,
`programs`.`deleted_at`                           as program_deleted_at,

`organization`.`id` as organization_id,
`organization`.`name` as organization_name,

`rebateReports_houses_products`.`id`              as id,
`rebateReports_houses_products`.`status`          as rebate_status,
`rebateReports_houses_products`.`rebateReport_id` as rebateReport_id,
`rebateReports_houses_products`.`created_at`      as created_at,
`rebateReports_houses_products`.`updated_at`      as updated_at
";

        if ( $excludeActionRequired ) {
            $statusExcludeCondition = "(`rebateReports_houses_products`.`status` != 'completed' AND `rebateReports_houses_products`.`status` != 'action required')";
        } else {
            $statusExcludeCondition = "`rebateReports_houses_products`.`status` != 'completed'";
        }

            if (isset($product_type) && isset($product_id)){
                //TODO: Check if all houses of organization needs to be return on program match, or just the specific house-product

                    if( $product_type === "App\\Models\\OrganizationCustomProduct" ) {
                        $rebatesHousesProducts = DB::select($selectStatement."
from `rebateReports_houses_products`
inner join (
    select `organizations`.*,
           `rebateReports`.`id` as org_rebateReport_id
    from `organizations`
        join `rebateReports` on organizations.id = rebateReports.organization_id
) as `organization` on `organization`.`org_rebateReport_id` = rebateReport_id
 inner join `products` as `preGottenProducts`
            on `preGottenProducts`.`id` = `rebateReports_houses_products`.`product_id`
 inner join `houses` as `houses` on `houses`.`id` = `rebateReports_houses_products`.`house_id`
 left join `sub_contractors` as `subcontractor`
           on `subcontractor`.`id` = `rebateReports_houses_products`.`subcontractor_provider_id`
 left join (
select `claims`.`id`,
   `claims`.`status`,
   `claims`.`deleted_at`,
   `claim_rebateReport`.`rebateReport_id`,
   `claim_rebateReport`.`approved_at`
from `claims`
     left join `claim_rebateReport` on `claim_rebateReport`.`claim_id` = `claims`.`id`
) as `claims` on `claims`.`rebateReport_id` = `rebateReports_houses_products`.`id`
 left join `product_categories` as `product_categories`
           on `product_categories`.`id` = `preGottenProducts`.`category_id`
         left join `organization_customProducts` on `organization_customProducts`.`product_id` = `rebateReports_houses_products`.`product_id`
 left join `sub_divisions` as `subdivisions` on `subdivisions`.`id` = `houses`.`subdivision_id`
 left join (
select Distinct `programs`.`id`                  as `program_id`,
            `products_programs`.`product_id` as `program_product_id`,
            `programs`.*
from `programs`
     join `products_programs` on `products_programs`.`program_id` = `programs`.`id`
) as `programs` on
`programs`.`program_product_id` = `preGottenProducts`.`id`

where ".$statusExcludeCondition."
and claims.id is null
and `claims`.`approved_at` is null
  and `organization`.`id` = `organization_customProducts`.`organization_id`
  and `rebateReports_houses_products`.`product_id` = ".$product_id."
  and `houses`.`deleted_at` is null
");
                    } else {
                        $rebatesHousesProducts = DB::select($selectStatement."
from `rebateReports_houses_products`
inner join (
    select `organizations`.*,
           `rebateReports`.`id` as org_rebateReport_id
    from `organizations`
        join `rebateReports` on organizations.id = rebateReports.organization_id
) as `organization` on `organization`.`org_rebateReport_id` = rebateReport_id
 inner join `products` as `preGottenProducts`
            on `preGottenProducts`.`id` = `rebateReports_houses_products`.`product_id`
 inner join `houses` as `houses` on `houses`.`id` = `rebateReports_houses_products`.`house_id`
 left join `sub_contractors` as `subcontractor`
           on `subcontractor`.`id` = `rebateReports_houses_products`.`subcontractor_provider_id`
 left join (
select `claims`.`id`,
   `claims`.`status`,
   `claims`.`deleted_at`,
   `claim_rebateReport`.`rebateReport_id`,
   `claim_rebateReport`.`approved_at`
from `claims`
     left join `claim_rebateReport` on `claim_rebateReport`.`claim_id` = `claims`.`id`
) as `claims` on `claims`.`rebateReport_id` = `rebateReports_houses_products`.`id`
 left join `product_categories` as `product_categories`
           on `product_categories`.`id` = `preGottenProducts`.`category_id`
 left join `sub_divisions` as `subdivisions` on `subdivisions`.`id` = `houses`.`subdivision_id`
 left join (
select Distinct `programs`.`id`                  as `program_id`,
            `products_programs`.`product_id` as `program_product_id`,
            `programs`.*
from `programs`
     join `products_programs` on `products_programs`.`program_id` = `programs`.`id`
) as `programs` on
`programs`.`program_product_id` = `preGottenProducts`.`id`

where ".$statusExcludeCondition."
and claims.id is null
and `claims`.`approved_at` is null
and `preGottenProducts`.`id` = ".$product_id."
and `houses`.`deleted_at` is null
");
                    }
            } else {
                $rebatesHousesProducts = DB::select($selectStatement."
        from `rebateReports_houses_products`
        inner join (
            select `organizations`.*,
                   `rebateReports`.`id` as org_rebateReport_id
            from `organizations`
                join `rebateReports` on organizations.id = rebateReports.organization_id
        ) as `organization` on `organization`.`org_rebateReport_id` = rebateReport_id
         inner join `products` as `preGottenProducts`
                    on `preGottenProducts`.`id` = `rebateReports_houses_products`.`product_id`
         inner join `houses` as `houses` on `houses`.`id` = `rebateReports_houses_products`.`house_id`
         left join `sub_contractors` as `subcontractor`
                   on `subcontractor`.`id` = `rebateReports_houses_products`.`subcontractor_provider_id`
         left join (
        select `claims`.`id`,
           `claims`.`status`,
           `claims`.`deleted_at`,
           `claim_rebateReport`.`rebateReport_id`,
           `claim_rebateReport`.`approved_at`
        from `claims`
             left join `claim_rebateReport` on `claim_rebateReport`.`claim_id` = `claims`.`id`
        ) as `claims` on `claims`.`rebateReport_id` = `rebateReports_houses_products`.`id`
         left join `product_categories` as `product_categories`
                   on `product_categories`.`id` = `preGottenProducts`.`category_id`
         left join `sub_divisions` as `subdivisions` on `subdivisions`.`id` = `houses`.`subdivision_id`
         left join (
        select Distinct `programs`.`id`                  as `program_id`,
                    `products_programs`.`product_id` as `program_product_id`,
                    `programs`.*
        from `programs`
             join `products_programs` on `products_programs`.`program_id` = `programs`.`id`
        ) as `programs` on
        `programs`.`program_product_id` = `preGottenProducts`.`id`

        where ".$statusExcludeCondition."
        and claims.id is null
        and `claims`.`approved_at` is null
        and `programs`.`id` = ".$program_id."
        and `houses`.`deleted_at` is null
        ");
            }

//            throw new \Exception((json_encode($rebatesHousesProducts)));

            foreach ($rebatesHousesProducts as $sqlResult){
                if( !isset($sqlResult->organization_id) ) continue;
                if( $excludeActionRequired && $sqlResult->rebate_status == 'action required' ) continue; //Shouldn't be needed, should be taken care in sql already
                if( !isset($organizations[$sqlResult->organization_id]) ) {
                    $organizations[$sqlResult->organization_id] = [
                        'id'=>$sqlResult->organization_id,
                        'name'=>$sqlResult->organization_name,
                        'rebateReports'=>[]
                    ];
                }

                if( !isset($organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]) ){
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id] =
                        [
                            'id' => $sqlResult->rebateReport_id,
                            'NeedActionHousesMissingCoCount' =>  0 ,
                            'NeedActionHousesMissingAddressCount' => 0,
                            'ReadiedHouses' => [],
                            'NeedActionHousesWithCoAndAddress' => [],
                        ];
                }

                $houseModel = [
                    'id'=>$sqlResult->house_id,
                    'lot_number'=>$sqlResult->lot_number,
                    'address'=>$sqlResult->house_address,
                    'address2'=>$sqlResult->house_address2,
                    'project_number'=>$sqlResult->project_number,
                    'model'=>$sqlResult->model,
                    'confirmed_occupancy'=>$sqlResult->confirmed_occupancy,
                ];

                if ( (!isset($sqlResult->house_address) || empty($sqlResult->house_address)) )  $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]['NeedActionHousesMissingAddressCount']++;

                if ( (!isset($sqlResult->confirmed_occupancy) || empty($sqlResult->confirmed_occupancy)) )  $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]['NeedActionHousesMissingCoCount']++;

                $NeedActionHousesWithCoAndAddress = (
                    ($sqlResult->rebate_status == 'action required' && !$excludeActionRequired)
                    || (!isset($sqlResult->house_address) || empty($sqlResult->house_address))
                    || (!isset($sqlResult->confirmed_occupancy) || empty($sqlResult->confirmed_occupancy))
                );

                if ($NeedActionHousesWithCoAndAddress){
                    if( !isset($organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]['NeedActionHousesWithCoAndAddress'][$sqlResult->house_id]) ){
                        $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]['NeedActionHousesWithCoAndAddress'][$sqlResult->house_id]['model'] = $houseModel;
                    }
                } else if ($sqlResult->rebate_status == 'rebate ready'){
                    if( !isset($organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]['ReadiedHouses'][$sqlResult->house_id]) ){
                        $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]['ReadiedHouses'][$sqlResult->house_id]['model'] = $houseModel;
                    }
                }

                if( !isset(
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]
                )) {
                    $rebatesHousesProductsPivot = [
                        'id'=>$sqlResult->id,
                        'product_quantity'=>$sqlResult->product_quantity,
                        'houseProgramCount'=>0,
                        'products'=>[],
                        'requireFieldStatusPerHouse'=> [
                            'house_id' => $sqlResult->house_id,
                            'address' => $sqlResult->house_address,
                            'certificate_occupancy_correct' => true,
                            'brand_correct' => true,
                            'serial_number_correct' => true,
                            'model_number_correct' => true,
                            'date_of_installation_correct' => true,
                            'date_of_purchase_correct' => true,
                            'distributor_correct' => true,
                        ],
                    ];

                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id] = $rebatesHousesProductsPivot;
                }


                if( !isset(
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['products'][$sqlResult->product_id]
                )) {
                    $product = [
                        'id' => $sqlResult->product_id,
                        'require_quantity_reporting' => $sqlResult->require_quantity_reporting,
                        'minimum_unit' => $sqlResult->minimum_unit,
                        'name' => $sqlResult->product_name,
                        'bbg_product_code' => $sqlResult->bbg_product_code,
                        'category' => [
                            'id' => $sqlResult->product_categories_id,
                            'name' => $sqlResult->product_categories_name,
                        ],
                        'programs'=>[]
                    ];

                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['products'][$sqlResult->product_id] = $product;
                }

                if( !isset(
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['products'][$sqlResult->product_id]['programs'][$sqlResult->program_id]
                )) {
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['houseProgramCount']++;

                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['products'][$sqlResult->product_id]['programs'][$sqlResult->program_id] =
                        [
                          'id'=>  $sqlResult->program_id,
                          'name'=>  $sqlResult->program_name,
                        ];
                }

                //Confirm require fields per house
                if (
                    ($sqlResult->require_certificate_occupancy && (!isset($sqlResult->confirmed_occupancy) || empty($sqlResult->confirmed_occupancy)))
                    || $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                        [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                        [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['certificate_occupancy_correct'] !== true
                )
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['certificate_occupancy_correct'] = false;

                if (
                    ($sqlResult->require_brand && (!isset($sqlResult->product_brand) || empty($sqlResult->product_brand)))
                    || $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                        [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                        [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['brand_correct'] !== true
                )
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['brand_correct'] = false;

                if (
                    ($sqlResult->require_serial_number && (!isset($sqlResult->product_serial_number) || empty($sqlResult->product_serial_number)))
                    || $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                        [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                        [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['serial_number_correct'] !== true
                )
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['serial_number_correct'] = false;

                if (
                    ($sqlResult->require_model_number && (!isset($sqlResult->product_model_number) || empty($sqlResult->product_model_number)))
                    || $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['model_number_correct'] !== true
                )
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['model_number_correct'] = false;

                if (
                    ($sqlResult->require_date_of_installation && (!isset($sqlResult->product_date_of_installation) || empty($sqlResult->product_date_of_installation)))
                    || $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['date_of_installation_correct'] !== true
                )
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['date_of_installation_correct'] = false;

                if (
                    ($sqlResult->require_date_of_purchase && (!isset($sqlResult->product_date_of_purchase) || empty($sqlResult->product_date_of_purchase)))
                    || $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['date_of_purchase_correct'] !== true
                )
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['date_of_purchase_correct'] = false;

                if (
                    ($sqlResult->require_distributor && (!isset($sqlResult->subcontractor_id) || empty($sqlResult->subcontractor_id)))
                    || $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['distributor_correct'] !== true
                )
                    $organizations[$sqlResult->organization_id]['rebateReports'][$sqlResult->rebateReport_id]
                    [($NeedActionHousesWithCoAndAddress?'NeedActionHousesWithCoAndAddress':'ReadiedHouses')]
                    [$sqlResult->house_id]['pivots'][$sqlResult->id]['requireFieldStatusPerHouse']['distributor_correct'] = false;

//                throw new \Exception((json_encode($sqlResult)));

            }

//        throw new \Exception(json_encode($organizations));

        return $organizations;
    }

    public function rebateReports(): belongsToMany
    {
        return $this->belongsToMany(RebateReportsHousesProducts::class, 'claim_rebateReport', 'claim_id', 'rebateReport_id')
            ->using(claimsRebateReports::class)
            ->withPivot(
                'id',
                'rebateReport_id', // RebateReportsHousesProducts Pivot not rebate report
                'claim_id',
                'rebate_earned',
                'rebate_adjusted',
                'builder_allocation',
                'total_allocation',
                'note',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at',
                'approved_at',
                'approved_by'
            );
    }

    public function houseProductsForBuilder($root, $args, $context, $resolveInfo)
    {

        $results = $root->rebateReports()
            ->whereHas('rebateReports',function ($query)use($args){
                $query->where('organization_id',$args['orgId']);
            });

        return $results;
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id', 'id');
    }

    public function disputes(): HasMany
    {
        return $this->hasMany(Disputes::class, 'claim_id', 'id');
    }

    public function disputesCount(){

        $disputes = Disputes::pluck('status','id');
        $statusCount = $disputes->countBy();

        return [
            'totalDisputesCount'=>$disputes->count(),
            'openDisputesCount'=>$statusCount['open'],
            'closeDisputesCount'=>$statusCount['close'],
        ];
    }

    public function totalDisputesCount()
    {
        return $this->disputes()->count();
    }

    public function openDisputesCount()
    {
        return $this->disputes()->where('status','open')->count();
    }

    public function closeDisputesCount()
    {
        return $this->disputes()->where('status','close')->count();
    }

    public function claimFiles(): HasMany
    {
        return $this->hasMany(ClaimFiles::class, 'claim_id');
    }

    public function claimPeriod(): BelongsTo
    {
        return $this->belongsTo(ClaimPeriods::class, 'claimPeriod_id', 'id');
    }

//    public function getPropertiesOfOrgFromLastClaim( $org_id ){
//      TODO: change to new claimPeriod Format, no model, see closePeriod
//        $currentClaimPeriod = $this->claimPeriod()->get();
//        if ( $currentClaimPeriod->quarter - 1 <= 0 ) {
//            $quarter = 1;
//            $year = $currentClaimPeriod->year - 1;
//        } else {
//            $quarter = $currentClaimPeriod->quarter - 1;
//            $year = $currentClaimPeriod->year;
//        }
//
//        $previousClaimPeriod = ClaimPeriods::where('year',$year)->where('quarter',$quarter)->firstOrFail();
//        $previousClaim = $previousClaimPeriod->claims()->where('organization_id',$this->organization_id)->first();
//
//        return $previousClaim->rebateReports()->where('status','completed')->count();
//    }

    //TODO: confirm if following is needed
    static function claimsWithinPeriod($year, $quarter)
    {
        switch ($quarter) {
            case 1:
                $month = 1;
                break;
            case 2:
                $month = 4;
                break;
            case 3:
                $month = 7;
                break;
            case 4:
            default:
                $month = 10;
                break;
        }

        $now = Carbon::now();
        $now->year = $year;
        $now->month = $month;

        $quarter_start = $now->copy()->firstOfQuarter();
        $quarter_end = $now->copy()->lastOfQuarter();

        $claims = Claims::where('claim_start_date','>=',$quarter_start)
            ->where('claim_end_date','<=',$quarter_end)
        ;

        return $claims;
//        Claims::claimsWithinPeriod()->get()
    }

    public function calculateCurrentTotal(){
        $total = 0;
        $builderTotal = [];

        if( $this->claim_type == 'factory' ){
            $rebates = DB::select(
"SELECT
    `rebateReports_houses_products`.*,

    `disputes`.`id` as `dispute_id`,
    `disputes`.`created_at` as `dispute_created_at`,
    `disputes`.`updated_at` as `dispute_updated_at`,
    `disputes`.`new_total_allocation` as `new_total_allocation`,
    `disputes`.`new_builder_allocation` as `new_builder_allocation`,

    `claim_rebateReport`.`claim_id`,
    `claim_rebateReport`.`rebate_earned`,
    `claim_rebateReport`.`rebate_adjusted`,
    `claim_rebateReport`.`builder_allocation`,
    `claim_rebateReport`.`total_allocation`,
    `claim_rebateReport`.`note`,

    `organization`.`id` as `organization_id`,
    `organization`.`name` as `organization_name`,
    `organization`.`member_tier` as `organization_member_tier`,

    `rebateReports_houses_products`.`id`              as id,
    `rebateReports_houses_products`.`status`          as rebate_status,
    `rebateReports_houses_products`.`rebateReport_id` as rebateReport_id,
    `rebateReports_houses_products`.`created_at`      as created_at,
    `rebateReports_houses_products`.`updated_at`      as updated_at

FROM `rebateReports_houses_products`
inner join `claim_rebateReport` on `claim_rebateReport`.`rebateReport_id` = `rebateReports_houses_products`.`id`
inner join (
    select `organizations`.*,
           `rebateReports`.`id` as org_rebateReport_id
    from `organizations`
        join `rebateReports` on organizations.id = rebateReports.organization_id
) as `organization` on `organization`.`org_rebateReport_id` = `rebateReports_houses_products`.`rebateReport_id`
left join `disputes` on `disputes`.`rebateReportHouseProduct_id` = `rebateReports_houses_products`.`id`
where `claim_rebateReport`.`claim_id`=" . $this->id
            );

//            throw new \Exception(json_encode($rebates));

            $rebates = collect($rebates);
            $rebatedAdded = [];

            foreach ( $rebates as $rebate ){

                //If rebate has already been added. This is due to sql returning each dispute as individual rebate and not grouped
                if (isset($rebatedAdded[$rebate->id])) continue;

                //Reset $disputeIds if needed
                $dispute = null;
                $allSameRebate = [];
                $disputeIds = [];

                foreach ( $rebates as $sameRebate ){
                    if ( $sameRebate->id == $rebate->id ){
                        if( isset($sameRebate->dispute_id) && !empty($sameRebate->dispute_id) ) {
                            $disputeIds[$sameRebate->dispute_id] = $sameRebate->dispute_id;

                            if(!isset($dispute) || $dispute === null){
                                $dispute=$sameRebate;
                            } else {
                                if(
                                    Carbon::createFromFormat('Y-m-d H:i:s',$sameRebate->dispute_created_at)
                                    >=
                                    Carbon::createFromFormat('Y-m-d H:i:s',$dispute->dispute_created_at)
                                ){
                                    $dispute=$sameRebate;
                                }
                            }
                        }
                    }
                }

                if(
                    isset($dispute) && !empty($dispute)
                    && isset($dispute->new_builder_allocation) && isset($dispute->new_total_allocation)
                ) {
                    $disputed = true;
                    $total += $dispute->new_total_allocation;
                    $rebate_total_allocation = $dispute->new_total_allocation;
                    $builder_total_allocation = $dispute->new_builder_allocation;
                } else {
                    $disputed = false;
                    $total += $rebate->total_allocation;
                    $rebate_total_allocation = $rebate->total_allocation;
                    $builder_total_allocation = $rebate->builder_allocation;
                }

                if(!isset($builderTotal[$rebate->organization_id])){
                    $builderTotal[$rebate->organization_id] = [
                        'builder_id'=>$rebate->organization_id,
                        'name'=>$rebate->organization_name,
                        'builder_tier'=>$rebate->organization_member_tier,
                        'builder_allocation'=> $builder_total_allocation,
                        'total'=>$rebate_total_allocation,
                        'rebatesId'=>[$rebate->id],
                        'disputesId'=>(isset($disputed) && isset($disputeIds)?$disputeIds:[]),
                        'disputed'=>(isset($disputed) && isset($disputeIds)?true:false)
                    ];
                } else {
                    $builderTotal[$rebate->organization_id] = [
                        'builder_id'=>$rebate->organization_id,
                        'name'=>$rebate->organization_name,
                        'builder_tier'=>$rebate->organization_member_tier,
                        'builder_allocation'=>($builderTotal[$rebate->organization_id]['builder_allocation'] + $builder_total_allocation),
                        'total'=>($builderTotal[$rebate->organization_id]['total'] + $rebate_total_allocation),
                        'rebatesId'=>array_merge($builderTotal[$rebate->organization_id]['rebatesId'],[$rebate->id]),
                        'disputesId'=>(isset($disputed) && isset($disputeIds)? array_merge($builderTotal[$rebate->organization_id]['disputesId'],$disputeIds):$builderTotal[$rebate->organization_id]['disputesId']),
                        'disputed'=>( (isset($disputed) && isset($disputeIds)) || $builderTotal[$rebate->organization_id]['disputed'] ? true : false)
                    ];
                }

                $rebatedAdded[$rebate->id] = true;
            }
        } else {
            $builders = $this->volumeClaimsBuilderRebates()->get();
            if ( $builders ) {
                foreach ( $builders as $builder ){

                    //TODO: check for builder_allocation/total_allocation before using them
                    //Volume cannot have disputes
                    $total += $builder->pivot->total_allocation;
                    if(!isset($builderTotal[$builder->id])){
                        $builderTotal[$builder->id] = [
                            'builder_id'=>$builder->id,
                            'name'=>$builder->name,
                            'builder_allocation'=> $builder->pivot->builder_allocation,
                            'total'=>$builder->pivot->total_allocation,
                            'note'=>[$builder->pivot->note],
                            'rebate_earned'=>$builder->pivot->rebate_earned,
                            'rebate_adjusted'=>$builder->pivot->rebate_adjusted,
                        ];

                    } else { //TODO: This else really wouldn't happen on volume claims
                        $builderTotal[$builder->id] = [
                            'builder_id'=>$builder->id,
                            'name'=>$builder->name,
                            'builder_allocation'=>($builderTotal[$builder->id]['builder_allocation'] + $builder->pivot->builder_allocation),
                            'total'=>($builderTotal[$builder->id]['total'] + $builder->pivot->total_allocation),
                            'note'=>array_merge($builderTotal[$builder->id]['note'],[$builder->pivot->note]),
                            'rebate_earned'=>($builderTotal[$builder->id]['rebate_earned'] + $builder->pivot->rebate_earned),
                            'rebate_adjusted'=>($builderTotal[$builder->id]['rebate_adjusted'] + $builder->pivot->rebate_adjusted)
                        ];
                    }
                }
            }
        }

        return [
            'total'=>round($total, 2),
            'builderTotals'=>$builderTotal
        ];
    }

    public function allManufacturersAndSuppliersNotes(){
        $notes = collect([]);
        $rebates = $this->rebateReports()->get(); //this is the pivot not the actual rebate

        if($rebates){
            foreach ($rebates as $rebateHouseProductPivot){
                $products = $rebateHouseProductPivot->products()->get();
                if($products){
                    foreach ($products as $product){
                        $programs = $product->programs()->get();
                        if($programs){
                            foreach ($programs as $program){
                                $company = $program->company()->first();
                                if(!empty($company->notes) && !$notes->contains($company->notes)) {
                                    $notes->push($company->notes);
                                }
                            }
                        }
                    }
                }
            }
        }
        return $notes;
    }

    public function report_period(){
        $period = '';

        if(isset($this->report_quarter) && !empty($this->report_quarter)) $period .= 'Q'.$this->report_quarter;
        if(
            isset($this->report_year) && !empty($this->report_year) &&
            isset($this->report_quarter) && !empty($this->report_quarter)
        ) $period .= ' ';
        if(isset($this->report_year) && !empty($this->report_year)) $period .= $this->report_year;


        return $period;
    }

//    public function claim_template(): BelongsTo
//    {
//        return $this->belongsTo(ProductsPrograms::class, 'claim_template_product_id', 'product_id');
//    }

    public function claim_template(): MorphTo
    {
        return $this->morphTo('claim_template', 'claim_template_product_type', 'claim_template_product_id', 'product_id');
    }

    public function propertyUnitCount(){
        $count = null;
        $program = $this->program()->first();

        if( !isset($program) ) throw new \Exception("No Program");
        switch ( $program->bbg_rebate_unit ) {
            case "Per Unit":
                foreach( $this->rebateReports()->get() as $rebate ) {
                    $count += $rebate->product_quantity;
                }
            break;
            default;
                $count += $this->rebateReports()->distinct('house_id')->count();
        }

        return [
            'type'=>$program->bbg_rebate_unit,
            'count'=>$count
        ];
    }

    public static function distinctReportPeriod(){
        $result = collect([]);

        $claims = Claims::
        select([
                DB::raw('concat(report_year, report_quarter) as report_period'),
                'report_year',
                'report_quarter'
            ])
            ->distinct('report_period')->get();

        $claims->each(function ($item, $key) use ($result) {

            if ( !empty($item['report_quarter']) && !empty($item['report_year']) ){
                $period = '';
                if(isset($item['report_quarter']) && !empty($item['report_quarter'])) $period .= 'Q'.$item['report_quarter'];
                if(
                    isset($item['report_quarter']) && !empty($item['report_quarter']) &&
                    isset($item['report_year']) && !empty($item['report_year'])
                ) $period .= ' ';
                if(isset($item['report_year']) && !empty($item['report_year'])) $period .= $item['report_year'];
                $result->push([
                    'year'=>$item['report_year'],
                    'quarter'=>$item['report_quarter'],
                    'report_period'=>$period,
                ]);
            }
        });
        return $result;
    }

    public static function distinctReportPeriodForCloseClaims(){
        $result = collect([]);

        $claims = Claims::
            whereIn('status', ['close','ready to close'])
            ->select([
                DB::raw('concat(report_year, report_quarter) as report_period'),
                'report_year',
                'report_quarter'
            ])
            ->distinct('report_period')->get();

        $claims->each(function ($item, $key) use ($result) {

            if ( !empty($item['report_quarter']) && !empty($item['report_year']) ){
                $period = '';
                if(isset($item['report_quarter']) && !empty($item['report_quarter'])) $period .= 'Q'.$item['report_quarter'];
                if(
                    isset($item['report_quarter']) && !empty($item['report_quarter']) &&
                    isset($item['report_year']) && !empty($item['report_year'])
                ) $period .= ' ';
                if(isset($item['report_year']) && !empty($item['report_year'])) $period .= $item['report_year'];
                $result->push([
                    'year'=>$item['report_year'],
                    'quarter'=>$item['report_quarter'],
                    'report_period'=>$period,
                ]);
            }
        });
        return $result;
    }

    public static function getOldestOpenClaimPeriod()
    {
        $claim = Claims::where('status','!=','close')
            ->whereNotNull('report_year')
            ->whereNotNull('report_quarter')
            ->orderBy('report_year')
            ->select([
                DB::raw('concat(report_year, report_quarter) as report_period'),
                'report_year',
                'report_quarter'
            ])
            ->first();

        if ( !$claim ) return [];

        if ( !empty($claim['report_quarter']) && !empty($claim['report_year']) ){
            $period = '';
            if(isset($claim['report_quarter']) && !empty($claim['report_quarter'])) $period .= 'Q'.$claim['report_quarter'];
            if(
                isset($claim['report_quarter']) && !empty($claim['report_quarter']) &&
                isset($claim['report_year']) && !empty($claim['report_year'])
            ) $period .= ' ';
            if(isset($claim['report_year']) && !empty($claim['report_year'])) $period .= $claim['report_year'];
            $result=[
                'year'=>$claim['report_year'],
                'quarter'=>$claim['report_quarter'],
                'report_period'=>$period,
            ];
        }

        return $result;
    }

    public static function closeClaimPeriod($year,$quarter){

        DB::beginTransaction();
        try {
            $openClaims = Claims::whereNotIn('status',['close','ready to close'])
                ->where('report_quarter',$quarter)
                ->where('report_year',$year)
                ->exists()
            ;
            if($openClaims) throw new \Exception('Cannot Close Period, Non close rebates');


            $claims = Claims::where('status','ready to close')
                ->where('report_quarter',$quarter)
                ->where('report_year',$year)
                ->get()
            ;

            foreach ($claims as $claim){
                $noneApproveRebate = $claim->rebateReports()->wherePivotNull('approved_at')->exists();
                if($noneApproveRebate) throw new \Exception('Cannot Close Period, Non close rebates');
                $claim->status = 'close';
                $claim->save();
            }
            DB::commit();
        } catch (\Exception $ex){
            DB::rollBack();
            throw  $ex;
        }

        event( new ClaimPeriodClose($quarter,$year));

        return $claims;
    }

    public function readyToClose(){

        $uncloseRebates = $this->rebateReports()->wherePivotNull('approved_at')->exists();
        $uncloseVolumeRebate = $this->volumeClaimsBuilderRebates()->wherePivotNull('approved_at')->exists();

        return (
            $this->status === 'ready to close'
            && !$uncloseVolumeRebate
            && !$uncloseRebates
            ? true : false
        );
    }

    public static function extractUniqueClaimPeriod( Collection $claims ){
        $result = collect([]);

        $claims->each(function ($item, $key) use ($result) {
            if(isset($item['claim_start_date']) && isset($item['claim_end_date'])){
                $result->push([
                    'claim_start_date'=>substr($item['claim_start_date'],0,10),
                    'claim_end_date'=>substr($item['claim_end_date'],0,10)
                ]);
            }
        });

        $result = $result->unique(function ($item){
           return $item['claim_start_date'].$item['claim_end_date'];
        });

        return $result;
    }

    public function save(array $options = [])
    {

        if ( $this->status === 'ready to close' && !isset($this->report_quarter) && !isset($this->report_year) ){
            $now = Carbon::now();
            $this->report_year = $now->year;
            $this->report_quarter = $now->quarter;
        }

        $results = parent::save($options);

        return $results;
    }
}
