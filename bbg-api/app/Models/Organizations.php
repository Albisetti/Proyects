<?php

namespace App\Models;

use App\Events\territoryManagerAssigned;
use App\Helpers\ClaimReporting;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Jenssegers\Mongodb\Relations\BelongsTo;
use Laravel\Scout\Builder;
use Laravel\Scout\Searchable;
use MeiliSearch\Endpoints\Indexes;

class Organizations extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        "id",
        "organization_type",
        "name",
        "abbreviation",
        "code",
        "address",
        "address2",
        "city",
        "zip_postal",
        "phone_number",
        "notes",
        "member_tier",
        "program_id",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at"
    ];

    public function territoryManagers(): BelongsToMany
    {
        return $this
            ->belongsToMany(User::class, 'organizations_territoryManagers','organization_id', 'user_id')
            ->using(builders_territoryManagers::class)
            ;
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'organizations_users','organization_id', 'user_id');
    }

    public function state(): HasOne
    {
        return $this->hasOne(State::class, "id", "state_id");
    }

    public function approved_states(): BelongsToMany
    {
        return $this->belongsToMany(State::class, 'builders_approvedStates','organization_id', 'state_id');
    }

    public function supplyingPrograms(): HasMany
    {
        return $this->hasMany(Programs::class, 'company_id', 'id');
    }

    public function programs(): BelongsToMany
    {
        return $this->belongsToMany(Programs::class, 'programs_participants','organization_id', 'program_id')
            ->using(ProgramParticipants::class)
            ->withPivot(
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

    public function availablePrograms($root, $args, $context, $resolveInfo){

        $model = $root;
        $buildersApprovedStates = $model->approved_states()->pluck('iso_code')->all();

        if(empty($buildersApprovedStates)) {
//            throw new \Exception("Organization does not have any approved states");
//            return Programs::where('id',-1);//Errors if null or [], needs to be an object with paginate
        }

        $buildersApprovedStatesFacetString = 'iso_codes = ' . implode( ' OR iso_codes = ',$buildersApprovedStates);
        $CanadaRegionApproved = collect($buildersApprovedStates)->contains(function ($value,$key){
            return substr($value, 0, 3) === 'CA-';
        });
        $USRegionApproved = collect($buildersApprovedStates)->contains(function ($value,$key){
            return substr($value, 0, 3) === 'US-';
        });

        $programs = Programs::
        where(function ($query)use($model,$buildersApprovedStates,$CanadaRegionApproved,$USRegionApproved) {
            if( !empty($buildersApprovedStates) ){
                $query->where(function ($query)use($model,$buildersApprovedStates,$CanadaRegionApproved,$USRegionApproved) {

                    $query->where(function ($query) use ($buildersApprovedStates,$CanadaRegionApproved,$USRegionApproved) {
                        $query->where(function ($query) use ($buildersApprovedStates) {
                            $query->where('valid_region_type', 'Custom')
                                ->whereHas('regions', function ($query) use ($buildersApprovedStates) {
                                    $query->whereIn('iso_code', $buildersApprovedStates);
                                });
                        });

                        if ( $CanadaRegionApproved || $USRegionApproved ) {
                            $query->orWhere(function ($query) {
                                $query->where('valid_region_type', 'US And CA');
                            });
                        }

                        if ( $USRegionApproved ) {
                            $query->orWhere(function ($query) {
                                $query->where('valid_region_type', 'US');
                            });
                        }

                        if ( $CanadaRegionApproved ) {
                            $query->orWhere(function ($query){
                                $query->where('valid_region_type', 'CA');
                            });
                        }
                    })
                    ->where('available_specific_member_only',false);
                });
            }
        })
            ->orWhere(function ($query)use($model){
                $query->whereHas('participants',function ($query)use($model){
                    $query->where('organizations.id',$model->id);
                });
//                $query->where('available_specific_member_only',true)
//                    ->whereHas('participants',function ($query)use($model){
//                        $query->where('organizations.id',$model->id);
//                    });
            })
        ;

        return $programs;
    }

    public static function searchAvailablePrograms($organization_id,$excludeUsedProgram=false,$search=''){

        //Can't have $this in static?

        $model = Organizations::find($organization_id);
        if(!$model) return Programs::where('id',-1); //If no organization found return empty results
        $buildersApprovedStates = $model->approved_states()->pluck('iso_code')->all();
        $participatingPrograms = $model->programs()->pluck('programs.id')->toArray();

        if(empty($buildersApprovedStates)) {
//            throw new \Exception("Organization does not have any approved states");
//            return Programs::where('id',-1);//Errors if null or [], needs to be an object with paginate
            $buildersApprovedStatesFacetString = 'iso_codes = null';
        } else {
            $buildersApprovedStatesFacetString = 'iso_codes = ' . implode( ' OR iso_codes = ',$buildersApprovedStates);
        }

        $CanadaRegionApproved = collect($buildersApprovedStates)->contains(function ($value,$key){
            return substr($value, 0, 3) === 'CA-';
        });
        $USRegionApproved = collect($buildersApprovedStates)->contains(function ($value,$key){
            return substr($value, 0, 3) === 'US-';
        });

        $filter = '';

        if ( !empty($participatingPrograms) ){
            $filter ='( id = ' . implode( ' OR id = ',$participatingPrograms) . ' ) OR ';
        }

        if( $CanadaRegionApproved || $USRegionApproved ) $filter .= '(';
        $filter .= '(valid_region_type = Custom AND (' . $buildersApprovedStatesFacetString . '))';
        if( $CanadaRegionApproved ) $filter .= ' OR (valid_region_type = CA OR valid_region_type = \'US And CA\')';
        if( $USRegionApproved ) $filter .= ' OR (valid_region_type = US OR valid_region_type = \'US And CA\')';
        if( $CanadaRegionApproved || $USRegionApproved ) $filter .= ' AND available_specific_member_only=0)';

        //available_specific_member_only

        if( $excludeUsedProgram ){
            $programsToExclude = $participatingPrograms;
            if( !empty($programsToExclude) ) {
                $programsToExcludeFilterString = '(id != '. implode( ' AND id != ', $programsToExclude ).')';
                $filter .= 'AND '.$programsToExcludeFilterString;
            }
        }

//        throw new \Exception(json_encode($filter));

        $programs = Programs::search($search, function (Indexes $meilisearch, $query, $options) use ($filter) {
            $options['filter'] = $filter;
            return $meilisearch->search($query, $options);
        });

        return $programs;
    }

    public static function searchAvailableProducts($organization_id,$trashedProducts=false, $search=''){
        $filter = '';

        $organization = Organizations::where('id',$organization_id)
            ->with(['approved_states','programs','customProducts'])
            ->first();

        if(empty($organization)) return Products::where('id',-1);

//        throw new \Exception(json_encode($organization->customProducts()->toSql()));
//        throw new \Exception(json_encode($organization->customProducts));

        if( !$organization->customProducts->isEmpty() ) { //TODO: Products OrderBy Inteferring
            $filter .= '( id = ' . implode( ' OR id = ',$organization->customProducts->pluck('id')->toArray()) . ' )';
        }

        $approved_states = $organization->approved_states;
        if( isset($approved_states) && !empty($approved_states) ) $buildersApprovedStates = $approved_states->pluck('iso_code')->all();

        $programs = $organization->programs;

        if (!empty($buildersApprovedStates)) {
            $buildersApprovedStatesFacetString = 'iso_codes = ' . implode(' OR iso_codes = ', $buildersApprovedStates);
            $CanadaRegionApproved = collect($buildersApprovedStates)->contains(function ($value, $key) {
                return substr($value, 0, 3) === 'CA-';
            });
            $USRegionApproved = collect($buildersApprovedStates)->contains(function ($value, $key) {
                return substr($value, 0, 3) === 'US-';
            });

            $RegionMatchingPrograms = Programs::
            where(function ($query) use ($buildersApprovedStates, $CanadaRegionApproved, $USRegionApproved) {
                $query->where(function ($query) use ($buildersApprovedStates, $CanadaRegionApproved, $USRegionApproved) {
                    $query->where(function ($query) use ($buildersApprovedStates) {
                        $query->where('valid_region_type', 'Custom')
                            ->whereHas('regions', function ($query) use ($buildersApprovedStates) {
                                $query->whereIn('iso_code', $buildersApprovedStates);
                            });
                    });

                    if ($CanadaRegionApproved || $USRegionApproved) {
                        $query->orWhere(function ($query) {
                            $query->where('valid_region_type', 'US And CA');
                        });
                    }

                    if ($USRegionApproved) {
                        $query->orWhere(function ($query) {
                            $query->where('valid_region_type', 'US');
                        });
                    }

                    if ($CanadaRegionApproved) {
                        $query->orWhere(function ($query) {
                            $query->where('valid_region_type', 'CA');
                        });
                    }
                })
                    ->where('available_specific_member_only', false);
            })->get();

            if($RegionMatchingPrograms) $programs = $programs->merge($RegionMatchingPrograms);
        }

//        throw new \Exception(json_encode($programs));

        if( !$programs->isEmpty() ) {
            $programIds =  $programs->pluck('id')->toArray();
            if( !$organization->customProducts->isEmpty() ) $filter .= ' OR ';
            $filter .= '( programIds = ' . implode( ' OR programIds = ',$programIds) . ' )';
        }

        //TODO: CHeck product customization_id
//        $organization_id

        if(!empty($filter)) {
            $filter = ' ( ' . $filter . ' ) AND ( customization_id = 0 OR customization_id = ' . $organization_id . ' )';
        } else {
            $filter = 'customization_id = ' . $organization_id;
        }

//        if(empty($filter)) return Products::where('id',-1); //If no custom products, or assign programs, or matching Region Program, must not have any products therefore return empty

        $products = Products::search($search,function (Indexes $meilisearch, $query, $options) use ($filter) {
            if(!empty($filter)) $options['filter'] = $filter;
            return $meilisearch->search($query, $options);
        });

        if($trashedProducts) $products->withTrashed();

        return $products;
    }

    public function customProducts(): BelongsToMany
    {
        return $this->belongsToMany(Products::class, 'organization_customProducts','organization_id', 'product_id')
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

    public function volumeClaims(): BelongsToMany
    {
        return $this->belongsToMany(Claims::class, 'volumeClaims_builders','builder_id','volumeClaim_id')
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

    public function disputes(): HasMany
    {
        return $this->hasMany(Disputes::class);
    }

    public function subcontractors(): BelongsToMany
    {
        return $this->belongsToMany(Organizations::class, 'subContractor_organization', 'organization_id', 'subcontractor_id');

    }

    public function dues(): HasMany
    {
        return $this->hasMany(OrganizationDues::class, 'organization_id', 'id');
    }

    public function thisYearsDue()
    {
        $now = Carbon::now();

        return $this->hasMany(OrganizationDues::class, 'organization_id', 'id')->where('year',$now->year )->first();
    }

    public function annualDue($year)
    {
        if( !isset($year) ){
            $now = Carbon::now();
            $year = $now->year;
        }

        return $this->hasMany(OrganizationDues::class, 'organization_id', 'id')->where('year', $year)->first();
    }

    public function bundles(): HasMany
    {
        return $this->hasMany(Bundles::class, 'organization_id');
    }

    public function subdivisions(): HasMany
    {
        return $this->hasMany(SubDivision::class, 'organization_id');
    }

    public function customization(): BelongsToMany
    {
        return $this->belongsToMany(Products::class,'organization_customProducts', 'organization_id', 'product_id')
            ->whereNotNull('customization_id')
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

    public function supplyingProducts(): HasMany
    {
        return $this->hasMany(Products::class, 'supplier_id');
    }

    public function rebateReports(): HasMany
    {
        return $this->hasMany(RebateReports::class, 'organization_id');
    }

    public function ActionRequiredRebatesCount(){
        $builder = $this;
        $rebateCount=0;
        $subdivisionCount=0;

        $rebates = RebateReportsHousesProducts::where('status','action required')->whereHas('rebateReports',function($query)use($builder){
            $query->where('organization_id',$builder->id);
        })->get()->unique('house_id');
        $rebateCount += $rebates->count();
        $subdivision = SubDivision::countSubdivisionsOfRebates($rebates);
        $subdivisionCount += $subdivision['subdivisionCount'];

        return [
            'rebateCount'=>$rebateCount,
            'subdivisionCount'=>$subdivisionCount
        ];
    }

    public function ReadiedRebatesCount(){
        $builder = $this;
        $rebateCount=0;
        $subdivisionCount=0;

        $rebates = RebateReportsHousesProducts::where('status','rebate ready')->whereHas('rebateReports',function($query)use($builder){
            $query->where('organization_id',$builder->id);
        })->get()->unique('house_id');
        $rebateCount += $rebates->count();
        $subdivision = SubDivision::countSubdivisionsOfRebates($rebates);
        $subdivisionCount += $subdivision['subdivisionCount'];

        return [
            'rebateCount'=>$rebateCount,
            'subdivisionCount'=>$subdivisionCount
        ];
    }

    public function getUsedOpenProductList()
    {
        $org_id = $this->id;
        $results = [];

        $rebates = RebateReportsHousesProducts::
            with(['products','claims'])
            ->whereHas('rebateReports',function ($query)use($org_id){
                $query->where('organization_id', $org_id);
            })
            ->where(function ($query){
                $query
                    ->whereDoesntHave('claims')
                    ->orWhere(function ($query){
                        $query->whereHas('claims',function ($query){
                            $query->whereNotIn('claims.status',['submitted','disputed','ready to close','close']);
//                            TODO: Also Check approved_by on the claim_rebateReport pivot?
                        });
                    });
            })
            ->get();

//        throw new \Exception(json_encode($rebates));

        foreach ( $rebates as $rebate ){
            if ( !isset($results[$rebate->products->id]) ){
                $results[$rebate->products->id] = [
                    'product' => $rebate->products,
                    'claims' => $rebate->claims
                ];
            } else {
                $results[$rebate->products->id] = [
                    'claims' => $rebate->claims->merge($results[$rebate->products->id]['claims'])
                ];
            }
        }

//        throw new \Exception(json_encode($results));

        return $results;
    }

    public function calculateClaimTotal($quarter,$year){

        $factoryAmount = 0;
        $volumeAmount = 0;
        $orgId = $this->id;

        $claims = Claims::where('report_year',$year)->where('report_quarter',$quarter)->where(function ($query)use($orgId){
            $query
                ->whereHas('rebateReports',function ($query)use($orgId){
                    $query->whereHas('rebateReports', function ($query)use($orgId){
                        $query->where('organization_id', $orgId);
                    });
                })
                ->orWhereHas('volumeClaimsBuilderRebates',function ($query)use($orgId){
                        $query->where('builder_id', $orgId);
                })
            ;
        })
        ->with(['rebateReports','rebateReports.rebateReports','rebateReports.rebateReports.organization','volumeClaimsBuilderRebates'])
        ->get();

        foreach ( $claims as $claim ){
            switch ( $claim->claim_type ) {
                case 'factory':
//                    $claimRebates = $claim->rebateReports->whereHas('rebateReports', function ($query)use($orgId){
//                        $query->where('organization_id', $orgId);
//                    })->get();

                    if ( isset($claim->rebateReports) && !empty($claim->rebateReports) ){
                        foreach ($claim->rebateReports as $claimRebate){
                            if( $claimRebate->rebateReports->organization_id == $orgId )
                                $factoryAmount += $claimRebate->pivot->builder_allocation;
                        }
                    }

                    break;
                case 'volume':
                    $volumeClaimsBuilderRebates = $claim->volumeClaimsBuilderRebates->where('id',$orgId)->first();

                    $volumeAmount += $volumeClaimsBuilderRebates->pivot->builder_allocation;
                    break;
                default:
            }
        }

        $annualDue = $this->annualDue($year);
        if($annualDue) {
            $annualDueAmount = $annualDue->totalPayedQuarter($quarter, $year);
        } else {
            $annualDueAmount = 0;
        }

        return [
            'factoryRebate'=>round($factoryAmount, 2),
            'volumeRebate'=>round($volumeAmount, 2),
            'duePayment'=>round($annualDueAmount, 2),
            'total'=>round(($factoryAmount+$volumeAmount-$annualDueAmount), 2)
        ];
    }

    public function calculateYearRangeClaimTotal($last=0){

        $now = Carbon::now();
        $factoryAmount = null;
        $volumeAmount = null;
        $orgId = $this->id;

        $claims = Claims::whereIn('status',['ready to close','close'])
            ->where('report_year','>=',(intval($now->format('Y'))-$last))
            ->where(function($query)use($orgId){
                $query->whereHas('rebateReports',function ($query)use($orgId){
                    $query->whereHas('rebateReports', function ($query)use($orgId){
                        $query->where('organization_id', $orgId);
                    });
                });
            })
//            ->with(['rebateReports','rebateReports.rebateReports'])
//            ->get();
        ;

        $totals = ClaimReporting::builderClaimTotal($claims,$orgId);

        return [
            'total'=>round($totals['total'], 2),
            'programsAllocation'=>$totals['contributingPrograms']
        ];
    }

    public function membershipValue()
    {
        $orgId = $this->id;

        $claims = Claims::whereIn('status',['ready to close','close'])
            ->where(function($query)use($orgId){
                $query->whereHas('rebateReports',function ($query)use($orgId){
                    $query->whereHas('rebateReports', function ($query)use($orgId){
                        $query->where('organization_id', $orgId);
                    });
                });
            })
        ;

        $claimReport = ClaimReporting::builderClaimTotal($claims,$orgId);

        return [
            'total'=> ( isset($this->previousEarnedToDate) ? $this->previousEarnedToDate : 0 ) +
                ( isset($claimReport) && isset($claimReport['total']) ? $claimReport['total'] : 0),
            'programsAllocation'=>( isset($claimReport['contributingPrograms']) && !empty($claimReport['contributingPrograms']) ? $claimReport['contributingPrograms'] : [] )
        ];
    }

    public static function approveReadyToCloseClaims($org_id, $quarter, $year)
    {

        DB::beginTransaction();
        try {

            $factoryClaims = claimsRebateReports::
            whereNull('approved_at')
                ->whereHas('claim', function ($query) use ($quarter, $year) {
                    $query->where('report_quarter', $quarter)->where('report_year', $year)->where('status','!=','disputed');
                })
                ->whereHas('rebateReport', function ($query) use ($org_id) {
                    $query->whereHas('rebateReports', function ($query) use ($org_id) {
                        $query->where('organization_id', $org_id);
                    });
                })
                ->get();
//                ->update(['approved_at' => Carbon::now()]) //Setting the appoved_at on claimsRebateReports, also changes the rebate status to completed, since VolumeClaimsBuilders connects their rebate via this relation, this action also change their status properlly
            ;

            foreach ( $factoryClaims as $factoryClaim ){
                $factoryClaim->approved_at = Carbon::now();
                $factoryClaim->save([
                    'side_effect' => true
                ]);
            }

            $volumeClaims = VolumeClaimsBuilders::where('builder_id', $org_id)
                ->whereNull('approved_at')
                ->whereHas('claim', function ($query) use ($quarter, $year) {
                    $query->where('report_quarter', $quarter)->where('report_year', $year);
                })
//                ->update(['approved_at' => Carbon::now()])
                ->get();
            ;

            foreach ( $volumeClaims as $volumeClaim ){
                $volumeClaim->approved_at = Carbon::now();
                $volumeClaim->save([
                    'skipAllocation' => true
                ]);
            }

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        $org = Organizations::where('id',$org_id)->first();
        return $org;
    }

    public function projectedRevenue()
    {
        $projectedTotal = 0;
        $programs = collect([]);
        $claims = collect([]);
        $FactoryRebatereport = $this->rebateReports()->with('rebates','rebates.claims','rebates.claims.program')->first();

        if( $FactoryRebatereport ){
            $FactoryRebates = $FactoryRebatereport->rebates;
            foreach ($FactoryRebates as $FactoryRebate){
                if (
                    $FactoryRebate->claims->isEmpty()
                    || $FactoryRebate->claims->where('claim_type','factory')->whereNotIn('status',['ready to close','close'])->isEmpty()
                ) continue;

                $claim = $FactoryRebate->claims->where('claim_type','factory')->whereNotIn('status',['ready to close','close'])->first(); //A rebate (house-product) should only be claimable once.
                if(!$claims->contains($claim->id)){
                    $claims->push($claim->id);
//                    $total_allocation = (isset($claim->pivot->total_allocation) ? $claim->pivot->total_allocation : 0);
                    $builder_allocation = (isset($claim->pivot->builder_allocation) ? $claim->pivot->builder_allocation : 0);
//                    $bbgAllocation = $total_allocation - $builder_allocation;

                    $projectedTotal += $builder_allocation;

                    $program = $claim->program;
                    $programsIndex = $programs->search(function ($item, $key)use($program){
                        return $item->id == $program->id;
                    });
                    if ( $programsIndex !== false  ){
                        $programs[$programsIndex]['contributedTotal'] += round($builder_allocation,2);
                    } else {
                        $program->contributedTotal = round($builder_allocation,2);
                        $programs->push($program);
                    }
                }
            }
        }

        $volumeClaims = $this->volumeClaims()->where('claim_type','volume')->whereNotIn('status',['ready to close','close'])->get();
        foreach ($volumeClaims as $volumeClaim){
            if(!$claims->contains($volumeClaim->id)) {
                $claims->push($volumeClaim->id);
//                $total_allocation = (isset($volumeClaim->pivot->total_allocation) ? $volumeClaim->pivot->total_allocation : 0);
                $builder_allocation = (isset($volumeClaim->pivot->builder_allocation) ? $volumeClaim->pivot->builder_allocation : 0);
//                $bbgAllocation = $total_allocation - $builder_allocation;

                $projectedTotal += $builder_allocation;

                $program = $volumeClaim->program()->first();
                $programsIndex = $programs->search(function ($item, $key)use($program){
                    return $item->id == $program->id;
                });
                if ( $programsIndex !== false  ){
                    $programs[$programsIndex]['contributedTotal'] += round($builder_allocation,2);
                } else {
                    $program->contributedTotal = round($builder_allocation,2);
                    $programs->push($program);
                }
            }
        }

        $programs=$programs->unique('id');
        $usedProgramIds = $programs->pluck('id');

        $now = Carbon::now();
        $conversionsAllocation = collect([]);
        $conversions = ConversionFlatPayment::
        where(function ($query) use ($usedProgramIds, $now) {
            $query->whereDate('anticipated_payment_date', '>=', $now)
                ->whereHas('program', function ($query) use ($usedProgramIds) {
                    $query->whereIn('programs.id', $usedProgramIds->all());
                })
                ->doesntHave('payment');
        })
            ->orWhere(function ($query) use ($usedProgramIds, $now) {
                $query->whereDate('anticipated_payment_date', '<=', $now)
                    ->whereHas('program', function ($query) use ($usedProgramIds) {
                        $query->whereIn('programs.id', $usedProgramIds->all());
                    })
                    ->doesntHave('payment');
            })
            ->get();

        foreach ($conversions as $conversion){
            $projectedTotal +=$conversion->amount;
            $conversionsAllocation->push($conversion);
        }

        $conversionsAllocation = $conversionsAllocation->unique('id');

        return [
            'projectedTotal'=>round($projectedTotal,2),
            'programs'=>$programs->map(function ($item,$key){
                $item->contributedTotal = round($item->contributedTotal,2);
                return $item;
            }),
            'conversions'=>$conversionsAllocation
        ];
    }

    public function openClaimsSum( Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null )
    {
        $builder = $this;

        $claims = Claims::
            where(function ($query)use($builder){
                $query->whereHas('rebateReports',function ($query)use($builder){
                    $query->whereHas('rebateReports',function ($query)use($builder){
                        $query->where('organization_id',$builder->id);
                    });
                });
            })
            ->orWhere(function ($query)use($builder){
                $query->whereHas('volumeClaimsBuilderRebates',function ($query)use($builder){
                    $query->where('organizations.id',$builder->id);
                });
            })
        ;

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
        $builder = $this;

        $claims = Claims::whereHas('rebateReports',function ($query)use($builder){
            $query->whereHas('rebateReports',function ($query)use($builder){
                $query->where('organization_id',$builder->id);
            });
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

    public function toSearchableArray()
    {
        //php artisan scout:flush "App\Models\Organizations" && php artisan scout:import "App\Models\Organizations"

        $array = $this->toArray();

        if($this->users()->exists()) $array['users'] = $this->users()->pluck('users.id')->toArray();
        if($this->territoryManagers()->exists()) $array['territoryManagers'] = $this->territoryManagers()->pluck('users.id')->toArray();

        $rebateReports = $this->rebateReports()->first();
        if( $rebateReports ) {
            if($rebateReports->rebates()->where('status','action required')->exists()) {
                $array['hasActionRequireRebate'] = true;
            } else { $array['hasActionRequireRebate'] = false; }
            if($rebateReports->rebates()->where('status','rebate ready')->exists()) {
                $array['hasReadiedRebate'] = true ;
            } else { $array['hasReadiedRebate'] = false; }
            if($rebateReports->rebates()->where('status','completed')->exists()) {
                $array['hasCompletedRebate'] = true ;
            } else { $array['hasCompletedRebate'] = false; }
        }

        if($this->approved_states()->exists()) {
            $array['approvedStates'] = $this->approved_states()->pluck('iso_code')->toArray();

            $array['CanadaApproved'] = collect($array['approvedStates'])->contains(function ($value,$key){
                return substr($value, 0, 3) === 'CA-';
            });
            $array['USApproved'] = collect($array['approvedStates'])->contains(function ($value,$key){
                return substr($value, 0, 3) === 'US-';
            });
        }

        if($this->programs()->exists()) $array['participatingPrograms'] = $this->programs()->pluck('programs.id')->toArray();

        return $array;
    }

    public function save(array $options = [])
    {
        try {
            $newOrganization = $this->exists;

            $results = parent::save($options);

            if(!$newOrganization){
                $this->refresh();

                $singleBuildSubdivision = new SubDivision();
                $singleBuildSubdivision->name = 'Single Build';
                $singleBuildSubdivision->organization_id = $this->id;
                $singleBuildSubdivision->save(['notification'=>false]);
            }

        } catch (\Exception $ex){
            throw $ex;
        }

        return $results;
    }
}
