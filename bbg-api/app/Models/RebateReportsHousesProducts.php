<?php

namespace App\Models;

use App\Helpers\RebateReporting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Facades\Log;

class RebateReportsHousesProducts extends Pivot
{

    protected $table = 'rebateReports_houses_products';

    public $incrementing = true;

    protected $fillable = [
        'rebateReport_id',
        'house_id',
        'product_id',
        'status',
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
    ];

    public function products(): BelongsTo
    {
        return $this
            ->belongsTo(Products::class, 'product_id')->withTrashed();
    }

    public function houses(): BelongsTo
    {
        return $this
            ->belongsTo(Houses::class, 'house_id')->withTrashed();
    }

    public function rebateReports(): BelongsTo
    {
        return $this
            ->belongsTo(RebateReports::class, 'rebateReport_id');
    }

    public function readyForClaim(){

        $require_certificate_occupancy = false;
        $require_subcontractor_provider = false;
        $require_brand = false;
        $require_serial_number = false;
        $require_model_number = false;
        $require_date_of_installation = false;
        $require_date_of_purchase = false;
        $require_installer_pointer = false;
        $require_installer_company = false;
        $require_distributor = false;

        $house = $this->houses()->first();
        $product = $this->products()->first();

        //Determine what proofpoint are needed
        $programs = $product->programs()->get();

        if(
            !$require_certificate_occupancy
//                || !$require_subcontractor_provider
            || !$require_brand
            || !$require_serial_number
            || !$require_model_number
            || !$require_date_of_installation
            || !$require_date_of_purchase
//                || !$require_installer_pointer
//                || !$require_installer_company
            || !$require_distributor
        ){
            foreach ($programs as $program){
                if(!$require_certificate_occupancy && $program->require_certificate_occupancy) $require_certificate_occupancy = $program->require_certificate_occupancy;
//                    if(!$require_subcontractor_provider && $program->require_subcontractor_provider) $require_subcontractor_provider = $program->require_subcontractor_provider;
                if(!$require_brand && $program->require_brand) $require_brand = $program->require_brand;
                if(!$require_serial_number && $program->require_serial_number) $require_serial_number = $program->require_serial_number;
                if(!$require_model_number && $program->require_model_number) $require_model_number = $program->require_model_number;
                if(!$require_date_of_installation && $program->require_date_of_installation) $require_date_of_installation = $program->require_date_of_installation;
                if(!$require_date_of_purchase && $program->require_date_of_purchase) $require_date_of_purchase = $program->require_date_of_purchase;
//                    if(!$require_installer_pointer && $program->require_installer_pointer) $require_installer_pointer = $program->require_installer_pointer;
//                    if(!$require_installer_company && $program->require_installer_company) $require_installer_company = $program->require_installer_company;
                if(!$require_distributor && $program->require_distributor) $require_distributor = $program->require_distributor;
            }
        }

//        throw new \Exception(json_encode($require_certificate_occupancy));
//        throw new \Exception(json_encode($require_subcontractor_provider));
//        throw new \Exception(json_encode($require_brand));
//        throw new \Exception(json_encode($require_serial_number));
//        throw new \Exception(json_encode($require_model_number));
//        throw new \Exception(json_encode($require_date_of_installation));
//        throw new \Exception(json_encode($require_date_of_purchase));
//        throw new \Exception(json_encode($require_installer_pointer));
//        throw new \Exception(json_encode($require_installer_company));
//        throw new \Exception(json_encode($require_distributor));

//        throw new \Exception(json_encode($house->confirmed_occupancy));
//        throw new \Exception(json_encode($product->pivot));
//            throw new \Exception(json_encode($this->brand));
//            throw new \Exception(json_encode($this->product_serial_number));
//            throw new \Exception(json_encode($this->model_number));
//            throw new \Exception(json_encode($this->date_of_installation));
//            throw new \Exception(json_encode($this->date_of_purchase));
//            throw new \Exception(json_encode($this->installer_pointer));
//            throw new \Exception(json_encode($this->installer_company));
//            throw new \Exception(json_encode($this->distributor_id));

            if( $require_certificate_occupancy && (!isset($house->confirmed_occupancy) || empty($house->confirmed_occupancy) ) ) return false;
//        if( $require_subcontractor_provider && (!isset($this->subcontractor_provider) || empty($this->subcontractor_provider) ) ) return false;
            if( $require_brand && (!isset($this->product_brand) || empty($this->product_brand) ) ) return false;
            if( $require_serial_number && (!isset($this->product_serial_number) || empty($this->product_serial_number) ) ) return false;
            if( $require_model_number && (!isset($this->product_model_number) || empty($this->product_model_number) ) ) return false;
            if( $require_date_of_installation && (!isset($this->product_date_of_installation) || empty($this->product_date_of_installation) ) ) return false;
            if( $require_date_of_purchase && (!isset($this->product_date_of_purchase) || empty($this->product_date_of_purchase) ) ) return false;
//            if( $require_installer_pointer && (!isset($this->installer_pointer) || empty($this->installer_pointer) ) ) return false;
//            if( $require_installer_company && (!isset($this->installer_company) || empty($this->installer_company) ) ) return false;
            if( $require_distributor && (!isset($this->subcontractor_provider_id) || empty($this->subcontractor_provider_id) ) ) return false;

        //At this point, all needed proof points have been confirmed as filled
        return true;
    }

    public function requireFieldStatus(){

        $require_certificate_occupancy = false;
        $require_brand = false;
        $require_serial_number = false;
        $require_model_number = false;
        $require_date_of_installation = false;
        $require_date_of_purchase = false;
        $require_distributor = false;

        $house = $this->houses()->first();
        $product = $this->products()->first();

        //Determine what proofpoint are needed
        $programs = $product->programs()->get();

        if(
            !$require_certificate_occupancy
            || !$require_brand
            || !$require_serial_number
            || !$require_model_number
            || !$require_date_of_installation
            || !$require_date_of_purchase
            || !$require_distributor
        ){
            foreach ($programs as $program){
                if(!$require_certificate_occupancy && $program->require_certificate_occupancy) $require_certificate_occupancy = $program->require_certificate_occupancy;
                if(!$require_brand && $program->require_brand) $require_brand = $program->require_brand;
                if(!$require_serial_number && $program->require_serial_number) $require_serial_number = $program->require_serial_number;
                if(!$require_model_number && $program->require_model_number) $require_model_number = $program->require_model_number;
                if(!$require_date_of_installation && $program->require_date_of_installation) $require_date_of_installation = $program->require_date_of_installation;
                if(!$require_date_of_purchase && $program->require_date_of_purchase) $require_date_of_purchase = $program->require_date_of_purchase;
                if(!$require_distributor && $program->require_distributor) $require_distributor = $program->require_distributor;
            }
        }

        //At this point, all needed proof points have been confirmed as filled
        return [
            'certificate_occupancy_correct' => ( $require_certificate_occupancy && (!isset($house->confirmed_occupancy) || empty($house->confirmed_occupancy) ) ? false : true ),
            'brand_correct' => ( $require_brand && (!isset($this->product_brand) || empty($this->product_brand) ) ? false : true ),
            'serial_number_correct' => ( $require_serial_number && (!isset($this->product_serial_number) || empty($this->product_serial_number) ) ? false : true ),
            'model_number_correct' => ( $require_model_number && (!isset($this->product_model_number) || empty($this->product_model_number) ) ? false : true ),
            'date_of_installation_correct' => ( $require_date_of_installation && (!isset($this->product_date_of_installation) || empty($this->product_date_of_installation) ) ? false : true ),
            'date_of_purchase_correct' => ( $require_date_of_purchase && (!isset($this->product_date_of_purchase) || empty($this->product_date_of_purchase) ) ? false : true ),
            'distributor_correct' => ( $require_distributor && (!isset($this->subcontractor_provider_id) || empty($this->subcontractor_provider_id) ) ? false : true ),
        ];
    }

    public function requireFieldStatusPerHouse()
    {
        $results = [];

        $houseProducts = RebateReportsHousesProducts::where('house_id',$this->house_id)->with(['houses'])->get();

        foreach ($houseProducts as $houseProduct) {

            if (!isset($results[$this->house_id])) $results[$this->house_id] =
                [
                    'house_id' => $this->house_id,
                    'address' => $this->houses->address,
                    'certificate_occupancy_correct' => true,
                    'brand_correct' => true,
                    'serial_number_correct' => true,
                    'model_number_correct' => true,
                    'date_of_installation_correct' => true,
                    'date_of_purchase_correct' => true,
                    'distributor_correct' => true,
                ];
            $fieldStatus = $houseProduct->requireFieldStatus();
            if (!$fieldStatus['certificate_occupancy_correct']) $results[$this->house_id]['certificate_occupancy_correct'] = false;
            if (!$fieldStatus['brand_correct']) $results[$this->house_id]['brand_correct'] = false;
            if (!$fieldStatus['serial_number_correct']) $results[$this->house_id]['serial_number_correct'] = false;
            if (!$fieldStatus['model_number_correct']) $results[$this->house_id]['model_number_correct'] = false;
            if (!$fieldStatus['date_of_installation_correct']) $results[$this->house_id]['date_of_installation_correct'] = false;
            if (!$fieldStatus['date_of_purchase_correct']) $results[$this->house_id]['date_of_purchase_correct'] = false;
            if (!$fieldStatus['distributor_correct']) $results[$this->house_id]['distributor_correct'] = false;
        }

        return $results;
    }

    public function subcontractorProvider(): BelongsTo
    {
        return $this->belongsTo(SubContractors::class, 'subcontractor_provider_id');
    }

    //A house-product can only be claimed once, TODO:Move to belongsTo?
    public function claims(): belongsToMany
    {
        //rebateReport_id is the pivot id, no the rebateReport_id field
        return $this->belongsToMany(Claims::class,'claim_rebateReport', 'rebateReport_id','claim_id')
            ->using(claimsRebateReports::class)
            ->withPivot(
                'id',
                'rebateReport_id',
                'claim_id',
                'rebate_earned',
                'rebate_adjusted',
                'total_allocation',
                'builder_allocation',
                'note',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at',
                'approved_at'
            );
    }

    public function relatedToClaim()
    {
        return $this->claims()->exists();
    }

    public function claimed()
    {
        return $this->claims()->wherePivotNotNull('approved_at')->exists();
    }

    public function isModifiable()
    {

        if ( $this->claims()->doesntExist() ){
            return true;
        } else {
            return $this->claims()
                ->wherePivotNull('approved_at')
                ->orWhere(function($query){
                    $query->whereIn('claims.status',['submitted','disputed','ready to close','close']);
                })
                ->doesntExist();
        }
    }

    public function dispute(): HasOne
    {
        return $this->hasOne(Disputes::class, 'rebateReportHouseProduct_id');
    }

    public function disputed() {
        return $this->dispute()->exists();
    }

    public function houseProgramCount() {

        $allPrograms = collect([]);
        $houseProducts = RebateReportsHousesProducts::where('house_id', $this->house_id)->with(['products'])->get();

        foreach ($houseProducts as $product){
            if( $product->readyForClaim() ){
                $allPrograms = $allPrograms->merge($product->products->programs()->get());
            }
        }

        return $allPrograms->unique('id')->count();
    }


    public function claimPeriod(){
        $claim = $this->claims()->first(); //A house-product can only be claimed once

        if (!isset($claim)) return null;

        return [
            'claimStartDate'=>(isset($claim->claim_start_date)?$claim->claim_start_date:null),
            'claimEndDate'=>(isset($claim->claim_end_date)?$claim->claim_end_date:null),
            'reportQuarter'=>(isset($claim->report_quarter)?$claim->report_quarter:null),
            'reportYear'=>(isset($claim->report_year)?$claim->report_year:null),
        ];
    }

    public static function actionRequiredRebatesCount() {
        $rebates = RebateReportsHousesProducts::where('status','action required')->get()->unique('house_id');
        $subdivision = SubDivision::countSubdivisionsOfRebates($rebates);

        return [
            'rebateCount'=>$rebates->count(),
            'subdivisionCount'=>$subdivision['subdivisionCount']
        ];
    }

    public static function readiedRebatesCount() {
        $rebates = RebateReportsHousesProducts::where('status','rebate ready')->get()->unique('house_id');
        $subdivision = SubDivision::countSubdivisionsOfRebates($rebates);

        return [
            'rebateCount'=>$rebates->count(),
            'subdivisionCount'=>$subdivision['subdivisionCount']
        ];
    }

    public function generateReport(&$conversions, $rebate=null) {

        if(!isset($rebate) || empty($rebate)){
            //if $rebate not passed, use the instance of rebateReportsHousesProducts this was called on
            $rebateHouseProduct = $this;
            //TODO: interestingly enough, even if eager load relation outside of this method, those relation are not present on "this" (model)

            $rebateHouseProduct->load([
                'dispute',
                'houses',
                'rebateReports',
                'rebateReports.organization',
                'rebateReports.organization.programs',
                'products',
                'products.customization',
                'products.programs',
                'products.organizationOverwrites',
                'products.organizationOverwritesProgram',
            ]);

            $house = $rebateHouseProduct->houses;
            $rebateReport = $rebateHouseProduct->rebateReports;

            /* Programs associated with this report's products. */
            $product = $rebateHouseProduct->products;

        } else {
            $rebateHouseProduct = $rebate;

            $house = $rebateHouseProduct->houses;
            $rebateReport = $rebateHouseProduct->rebateReports;

            /* Programs associated with this report's products. */
            $product = $rebateHouseProduct->products;
        }

        /* Try to find a matching house_id and eagerly load its rebateReports relationship. */
        /* Ensure house exists! */
        if(!$house) {
            throw new \Exception("No house with ID {$rebateHouseProduct->house_id} was found, aborting.");
            return 1;
        }

        if(!$product) {
            throw new \Exception("No product with ID {$rebateHouseProduct->product_id} was found, aborting.");
            return 1;
        }

        $property_type = $house->property_type;
        $results = [
            'conversions' => &$conversions,
            'totals' => [
                'by_builder' => [],
                'bbg_keep' => [
                    'residential' 	=> 0,
                    'commercial' 	=> 0,
                    'multi-unit' 	=> 0,
                    'total' => 0
                ],
                'base' => [
                    'residential' => 0,
                    'commercial' => 0,
                    'multi-unit' => 0,
                    'total' => 0,
                    'post_conversion_total' => 0
                ]
            ]
        ];
        $disputes = [];

        foreach($product->programs as $program) {
            switch($program->type) {
                case 'factory':
                    if(isset($results['by_builder'][$rebateReport->organization_id][$program->id][$product->id])) { //If Builder has already use program-product, abort
                        break;
                    }

                    $rebate_allocation = RebateReporting::factoryRebateAllocations($program,
                        $product,
                        $rebateHouseProduct,
                        $conversions
                    );

                    if( isset($rebate_allocation['dispute']) ) $disputes[] = [
                        'dispute_id'=>$rebate_allocation['dispute']['dispute_ID'],
                        'base_rebate_amount'=>$rebate_allocation['dispute']['base_rebate_amount'],
                        'builder_keeps'=>$rebate_allocation['dispute']['builder_keeps']
                    ];

                    //DEBUG LINE, to see results from RebateReporting::factoryRebateAllocations
//                    if($rebateHouseProduct->id == 11641)
//                    throw new \Exception(json_encode($rebate_allocation));

                    if(!$rebate_allocation) {
                        Log::warning('Unable to determine factory rebate allocations, skipping program.');
                        break;
                    }

                    if($product->customization) {
                        //unique Product for Organization
                        $rebate_allocation['customization'] = $product->customization;
                    }
                    if($product->organizationOverwrites) {
                        //Organization Product overwrite
                        $rebate_allocation['organizationOverwrites'] = $product->organizationOverwrites;
                    }
                    if($product->organizationOverwritesProgram) {
                        //Program Product Overwrite
                        $rebate_allocation['programOverwrites'] = $product->organizationOverwritesProgram;
                    }

                    $results['by_builder'][$rebateReport->organization_id][$program->id][$product->id] = $rebate_allocation;

                    $results['totals']['bbg_keep']['total'] += $rebate_allocation['bbg_keeps'];
                    $results['totals']['base']['total'] += $rebate_allocation['base_rebate_amount'];
                    $results['totals']['base']['post_conversion_total'] += $rebate_allocation['post_conversion_base_rebate_amount'];

                    if(!isset($results['totals']['by_builder'][$rebateReport->organization_id])) {
                        $results['totals']['by_builder'][$rebateReport->organization_id] = [
                            'residential' => 0,
                            'commercial' => 0,
                            'multi-unit' => 0,
                            'total' => 0
                        ];
                    }

                    $results['totals']['by_builder'][$rebateReport->organization_id]['total'] += $rebate_allocation['builder_keeps'];

                    switch($property_type) {
                        case 'residential':
                            $results['totals']['bbg_keep']['residential'] += $rebate_allocation['bbg_keeps'];
                            $results['totals']['base']['residential'] += $rebate_allocation['base_rebate_amount'];
                            $results['totals']['by_builder'][$rebateReport->organization_id]['residential'] += $rebate_allocation['builder_keeps'];
                            break;

                            case 'commercial':
                                $results['totals']['bbg_keep']['commercial'] += $rebate_allocation['bbg_keeps'];
                                $results['totals']['base']['commercial'] += $rebate_allocation['base_rebate_amount'];
                                $results['totals']['by_builder'][$rebateReport->organization_id]['commercial'] += $rebate_allocation['builder_keeps'];
                                break;

                            case 'multi-unit':
                                $results['totals']['bbg_keep']['multi-unit'] += $rebate_allocation['bbg_keeps'];
                                $results['totals']['base']['multi-unit'] += $rebate_allocation['base_rebate_amount'];
                                $results['totals']['by_builder'][$rebateReport->organization_id]['multi-unit'] += $rebate_allocation['builder_keeps'];
                                break;

                        default:
                            break;
                    }

                    break;
            }
        }

        return ['result'=>$results,'dispute'=>$disputes];
    }

    public function delete()
    {
        if ( $this->claims()->where('status','!=','open')->exists() )
            throw new \Exception('Unable to remove a product from a property that is part of a started claim.');

        if ( $openClaims = $this->claims()->where('status','open')->pluck('claims.id')->all()) {

            $relations = claimsRebateReports::where('rebateReport_id', $this->id)->whereIn('claim_id',$openClaims)->delete();
        }

        parent::delete();
    }
}
