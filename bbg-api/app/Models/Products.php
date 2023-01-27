<?php

namespace App\Models;

use App\Helpers\ClaimReporting;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Laravel\Scout\Searchable;

class Products extends Model
{
    use HasFactory, Searchable, SoftDeletes;

//    const DELETED_AT = 'archived_at';

    protected $fillable = [
        'bbg_product_code',
        'product_group',
        'name',
        'description',
        'product_type',
        'status',
        'quantity',
        'supplier_id',
        'flat_builder_rebate',
        'flat_bbg_rebate'
    ];

    protected static function boot() {
        parent::boot();
        static::addGlobalScope('order', function ($product) {
            $product
                ->from(DB::raw("(select `prod`.*, `cat`.`name` as `cat_name`, group_concat(prog.name) as `prog_name`
from `products` as `prod`
         inner join `products_programs` as `prod_prog` on `prod_prog`.`product_id` = `prod`.`id`
         left join `programs` as `prog` on `prod_prog`.`program_id` = `prog`.`id`
         inner join `product_categories` as `cat` on `cat`.`id` = `prod`.`category_id`
group by bbg_product_code
order by `prog`.`name` asc, `cat`.`name` asc, LENGTH(bbg_product_code), bbg_product_code) as products"));

        });
    }

    public function supplier(): BelongsTo {
        return $this->belongsTo(Organizations::class, 'id', 'supplier_id');
    }

    public function customization(): HasOne {
        return $this->hasOne(OrganizationCustomProduct::class, 'organization_id', 'customization_id')->where('product_id','=',$this->id);
    }

    public function houses(): HasMany
    {
        return $this->hasMany(Houses::class, 'product_id', 'id');
    }

    public function productImages(): HasMany
    {
        return $this->hasMany(ProductImages::class, 'product_id');
    }

    public function bundles(): BelongsToMany
    {
        return $this->belongsToMany(Bundles::class, 'bundles_products', 'product_id', 'bundle_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo( ProductCategories::class, 'category_id' );
    }

    public function programs() : BelongsToMany
    {
        //return $this->hasMany(Products::class, "program_id","id");
        return $this->belongsToMany(Programs::class, "products_programs","product_id","program_id")
            ->using(ProductsPrograms::class)
            ->withPivot(
                'multi_reporting',
                'volume_bbg_rebate',
                'created_at',
                'updated_at'
            );
    }

    public function rebateReports(): BelongsToMany
    {
        return $this
            ->belongsToMany(RebateReports::class, 'rebateReports_houses_products', 'product_id', 'rebateReport_id')
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'house_id',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function rebateHouseProduct(){
        return $this->hasMany(RebateReportsHousesProducts::class, 'product_id');
    }

    public function specificRebateHouseProduct($rebateReport_id, $house_id){
        return $this->hasMany(RebateReportsHousesProducts::class, 'product_id')
            ->where('house_id',$house_id)
            ->where('rebateReport_id',$rebateReport_id)
//            -where('product_id', $this->id)->first()
            ->first()
            ;
    }

    public function rebateReportHouses(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'product_id', 'house_id')
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function rebateReportNeedActionHouses(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'product_id', 'house_id')
            ->wherePivot('status', 'action required')
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function rebateReportReadiedHouses(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'product_id', 'house_id')
            ->wherePivot('status', 'rebate ready')
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function rebateReportCompletedHouses(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'product_id', 'house_id')
            ->wherePivot('status', 'completed')
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function organizationOverwrites(): BelongsToMany
    {
        return $this->belongsToMany(Organizations::class, 'organization_customProducts', 'product_id','organization_id')
            ->using(OrganizationCustomProduct::class)
//            ->where('program_id', $program_id)
            ->withPivot(
                'program_id',//mapping or additionnal where needed to identify correct program
                'overwrite_amount_type',
                'residential_rebate_overwrite',
                'multi_unit_rebate_overwrite',
                'commercial_rebate_overwrite',
                'volume_bbg_rebate',
                'flat_builder_overwrite',
                'flat_bbg_overwrite',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function organizationOverwritesProgram(): BelongsToMany
    {
        return $this->belongsToMany(Programs::class, 'organization_customProducts', 'product_id','program_id')
            ->using(OrganizationCustomProduct::class)
//            ->where('program_id', $program_id)
            ->withPivot(
                'program_id',//mapping or additionnal where needed to identify correct program
                'overwrite_amount_type',
                'residential_rebate_overwrite',
                'multi_unit_rebate_overwrite',
                'commercial_rebate_overwrite',
                'volume_bbg_rebate',
                'flat_builder_overwrite',
                'flat_bbg_overwrite',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function organizationOverwritesPivotById($program_id, $organization_id)
    {
        return OrganizationCustomProduct::
        where('organization_id',$organization_id)
        ->where('program_id',$program_id)
        ->where('product_id',$this->id)
        ->first();
    }

    public function openClaimsSum( Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null )
    {
        $product = $this;

        $claims = Claims::whereHas('rebateReports',function ($query)use($product){
            $query->where('product_id',$product->id);
        });

        $openClaimQuery = ClaimReporting::SumClaimsList(
            $claims,
            ['open','ready','submitted','disputed'],
            null,
            null,
            ( isset($builderIds) ? $builderIds : null ),
            ( isset($programIds) ? $programIds : null ),
            ( isset($ProductIds) ? $ProductIds : null ),
            ( isset($regionIds) ? $regionIds : null ),
            ( isset($territoryManagerIds) ? $territoryManagerIds : null ) );

        return [
//            'volumeTotal'=>$openClaimQuery['volumeTotal'],
//            'factoryTotal'=>$openClaimQuery['factoryTotal']
            'volumeTotal'=>0,
            'factoryTotal'=>0
        ];
    }

    public function lastCloseClaim( Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null )
    {
        $product = $this;

        $claims = Claims::whereHas('rebateReports',function ($query)use($product){
            $query->where('product_id',$product->id);
        });

        $lastOpenClaim = ClaimReporting::getLastCloseClaim(
            $claims,
            ['ready to close','close'],
            null,
            null,
            ( isset($builderIds) ? $builderIds : null ),
            ( isset($programIds) ? $programIds : null ),
            ( isset($ProductIds) ? $ProductIds : null ),
            ( isset($regionIds) ? $regionIds : null ),
            ( isset($territoryManagerIds) ? $territoryManagerIds : null ) );

        return $lastOpenClaim;
    }

    public static function productRelation($arguments, $model, $connection_type = "BelongsToMany" ){

        $RelationPivotArgs = collect($arguments);

        //If single relation type
        if ( $connection_type === "BelongsTo" || $connection_type === "HasOne" ) {
            if (count($RelationPivotArgs) >= 2) {
                throw new \Exception(get_class($model) . " only accept single relation to the claim model, multiple relation resolver called");
            }
        }

        $connectRan = false;
        $disconnectRan = false;

        foreach ($RelationPivotArgs as $RelationConnectionType => $RelationPivotArg) {

            switch ($RelationConnectionType) {
                case "connect":
                    if ( $connectRan ) {
                        throw new \Exception(get_class($model) . " organization relation not properly formatted, do not use connect multiple time");
                    }
                    $connectRan = true;

                    //If single relation type
                    if ( $connection_type === "BelongsTo" || $connection_type === "HasOne" ) {
                        if ( gettype($RelationPivotArg) === "array" && count($RelationPivotArg) >=2 ) {
                            throw new \Exception(get_class($model) . " only accept single relation to the claim model");
                        }

                        $model->products->detach(); //if only 1 relation allowed, wipe previous relations
                    }

                        $model->products()->attach($RelationPivotArg);
                    break;
                case "disconnect":
                    if ( $disconnectRan ) {
                        throw new \Exception(get_class($model) . " organization relation not properly formatted, do not use disconnect multiple time");
                    }
                    $disconnectRan = true;

                    //If single relation type
                    if ( $connection_type === "BelongsTo" || $connection_type === "HasOne" ) {
                        if ( gettype($RelationPivotArg) === "array" && count($RelationPivotArg) >=2 ) {
                            throw new \Exception(get_class($model) . " only accept single relation to the claim model");
                        }
                    }

                    $model->products()->detach($RelationPivotArg);
                    break;
                case "create":
                    //TODO: is there a reason we're not using $user->roles()->attach($roleId, ['expires' => $expires]); format?
                    $disputesHousesPivot = new DisputesHouses();
                    $fillableFields = $disputesHousesPivot->getFillable();
                    $housePivotArg = collect($RelationPivotArg);

                    $disputesHousesPivot->dispute_id = $model->id;
                    foreach ($fillableFields as $field) {
                        //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                        if($housePivotArg->has($field)){
                            $disputesHousesPivot->$field = $housePivotArg[$field];
                        }
                    }
                    $disputesHousesPivot->save();

                    if(isset($housePivotArg['DisputeProducts'])) {

                        foreach ( $housePivotArg['DisputeProducts'] as $disputeProduct ) {

                            $disputesProductsPivot = new DisputesProducts();
                            $fillableFields = $disputesProductsPivot->getFillable();
                            $productPivotArg = collect($disputeProduct);

                            $disputesProductsPivot->dispute_house_id = $disputesHousesPivot->id;

                            foreach ($fillableFields as $field) {
                                //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                                if($productPivotArg->has($field)){
                                    $disputesProductsPivot->$field = $productPivotArg[$field];
                                }
                            }

                            $disputesProductsPivot->save();
                        }
                    }
                    break;
                case "upsert":
                    //TODO: is there a reason we're not using $user->roles()->attach($roleId, ['expires' => $expires]); format?
                    foreach ($RelationPivotArg as $index => $args) {
                        if ( empty($args->id) ) {
                            throw new \Exception(get_class($model) . " house relation not properly formatted, upsert is missing house_id");

                        }

                        $disputesHousesPivot = DisputesHouses::firstOrCreate(
                            ['dispute_id' => $model->id, 'house_id'=>$args->id]
                        );
                        $fillableFields = $disputesHousesPivot->getFillable();
                        $housePivotArg = collect($args);

                        foreach ($fillableFields as $field) {
                            //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                            if($housePivotArg->has($field)){
                                $disputesHousesPivot->$field = $housePivotArg[$field];
                            }
                        }
                        $disputesHousesPivot->save();

                        if(isset($housePivotArg['DisputeProducts'])) {

                            foreach ( $housePivotArg['DisputeProducts'] as $disputeProduct ) {

                                $disputesProductsPivot = new DisputesProducts();
                                $fillableFields = $disputesProductsPivot->getFillable();
                                $productPivotArg = collect($disputeProduct);

                                $disputesProductsPivot->dispute_house_id = $disputesHousesPivot->id;

                                foreach ($fillableFields as $field) {
                                    //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                                    if($productPivotArg->has($field)){
                                        $disputesProductsPivot->$field = $productPivotArg[$field];
                                    }
                                }

                                $disputesProductsPivot->save();
                            }
                        }
                    }
                    break;
                default:
            }
        }

        $model->save();
    }

    public function delete()
    {

        $needActionRebate = $this->rebateReportNeedActionHouses()->get();
        $readiedRebate = $this->rebateReportReadiedHouses()->get();

        DB::beginTransaction();

        try {
            foreach ( $needActionRebate->merge($readiedRebate)->all() as $rebate ) {
                $rebate->pivot->claims()->detach();
                $disputes = $rebate->pivot->dispute()->get();
                foreach ( $disputes as $dispute ) {
                    $dispute->delete();
                }
                $rebate->pivot->save();
            }
            DB::commit();
        } catch (\Exception $ex){
            DB::rollBack();
            throw $ex;
        }

        DB::beginTransaction();

        try {

            $this->rebateReportNeedActionHouses()->detach();
            $this->rebateReportReadiedHouses()->detach();
            $this->save();

            $results = parent::delete();
            DB::commit();
        } catch (\Exception $ex){
            DB::rollBack();
            throw $ex;
        }

        return $results;
    }

    public function toSearchableArray()
    {
        //php artisan scout:flush "App\Models\Products" && php artisan scout:import "App\Models\Products"

        $array = $this->toArray();

        //Deleted Boolean, since meilisearch cannot filter on null?

        //programIds, for organization search
        $this->load(['programs','organizationOverwritesProgram']);
        $programs = $this->programs;

        if( isset($this->organizationOverwritesProgram) && !empty($this->organizationOverwritesProgram) ){
            if( $programs){
                $programs = $programs->merge($this->organizationOverwritesProgram);
            } else {
                $programs = $this->organizationOverwritesProgram;
            }
        }

        $array['programIds'] = $programs->pluck('id')->toArray();

        if ( $this->customization_id === null ) $array['customization_id'] = 0;

        return $array;
    }
}
