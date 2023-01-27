<?php

namespace App\Helpers;

use App\Models\Claims;
use App\Models\claimsRebateReports;
use App\Models\OrganizationCustomProduct;
use App\Models\Organizations;
use App\Models\Products;
use App\Models\ProductsPrograms;
use App\Models\RebateReportsHousesProducts;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClaimReporting
{

    public static function filterClaims( $factoryClaimQuery, $volumeClaimQuery, $builderIds=null, $programIds=null, $productIds=null, $regionIds=null, $territoryManagerIds=null , $getResults=true){
        $factoryClaims = $factoryClaimQuery;
        $volumeClaims = $volumeClaimQuery;

        if(isset($builderIds)&&!empty($builderIds)) {
            $factoryClaims->whereHas('rebateReports',function ($query)use($builderIds){
                $query->whereHas('rebateReports',function ($query)use($builderIds){
                    $query->whereHas('organization',function ($query)use($builderIds){
                        $query->whereIn('organizations.id',$builderIds);
                    });
                });
            });

            $volumeClaims->whereHas('volumeClaimsBuilderRebates',function($query)use($builderIds){
                $query->whereIn('organizations.id',$builderIds);
            });
        }

        if(isset($programIds)&&!empty($programIds)) {
            $factoryClaims->whereHas('program',function ($query)use($programIds){
                $query->whereIn('programs.id',$programIds);
            });

            $volumeClaims->whereHas('program',function($query)use($programIds){
                $query->whereIn('programs.id',$programIds);
            });
        }

        if(isset($productIds)&&!empty($productIds)) {
            $factoryClaims->whereHas('rebateReports',function ($query)use($productIds){
                $query->whereHas('products',function ($query)use($productIds){
                    $query->whereIn('products.id',$productIds);
                });
            });

            $volumeClaims->whereHasMorph(
                'claim_template',
                [OrganizationCustomProduct::class, ProductsPrograms::class],
                function($query, $type)use($productIds){
                    switch ( $type ){
                        case OrganizationCustomProduct::class:
                            $column = 'product_id';
                            break;
                        case ProductsPrograms::class:
                            $column = 'product_id';
                            break;
                    }
                    $query->whereIn($column,$productIds);
                }
            );
        }

        if(isset($regionIds)&&!empty($regionIds)){
            $factoryClaims->whereHas('program',function ($query)use($regionIds){
                $query->whereHas('regions',function ($query)use($regionIds){
                    $query->whereIn('states.id',$regionIds);
                });
            });

            $volumeClaims->whereHas('program',function ($query)use($regionIds){
                $query->whereHas('regions',function ($query)use($regionIds){
                    $query->whereIn('states.id',$regionIds);
                });
            });
        }

        if(isset($territoryManagerIds)&&!empty($territoryManagerIds)){
            $factoryClaims->whereHas('rebateReports',function ($query)use($territoryManagerIds){
                $query->whereHas('rebateReports',function ($query)use($territoryManagerIds){
                    $query->whereHas('organization',function ($query)use($territoryManagerIds){
                        $query->whereHas('territoryManagers',function($query)use($territoryManagerIds){
                            $query->whereIn('users.id',$territoryManagerIds);
                        });
                    });
                });
            });

            $volumeClaims->whereHas('volumeClaimsBuilderRebates',function($query)use($territoryManagerIds){
                $query->whereHas('territoryManagers',function($query)use($territoryManagerIds){
                    $query->whereIn('users.id',$territoryManagerIds);
                });
            });
        }

        if($getResults){
            return [
                'factoryClaims'=>$factoryClaims->get(),
                'volumeClaims'=>$volumeClaims->get()
            ];
        } else {
            return [
                'factoryClaims'=>$factoryClaims,
                'volumeClaims'=>$volumeClaims
            ];
        }
    }

    public static function getClaims( Array $status=null, Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null ){
        $factoryClaims = Claims::where('claim_type','factory');
        $volumeClaims = Claims::where('claim_type','volume');

        if( isset($status) && !empty($status) ) {
            $factoryClaims->whereIn('status',$status);
            $volumeClaims->whereIn('status',$status);
        }

        if( isset($year) ) {
            $factoryClaims->where('report_year',$year);
            $volumeClaims->where('report_year',$year);
        }

        if( isset($quarter) ) {
            $factoryClaims->where('report_quarter',$quarter);
            $volumeClaims->where('report_quarter',$quarter);
        }

        $claims = self::filterClaims($factoryClaims,$volumeClaims,$builderIds,$programIds,$ProductIds, $regionIds,$territoryManagerIds);

        return [
            'factoryClaims'=>$claims['factoryClaims'],
            'volumeClaims'=>$claims['volumeClaims']
        ];
    }

    public static function SumClaims( Array $status=null, Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null ){
        $claims = self::getClaims($status,$year,$quarter,$builderIds,$programIds,$ProductIds, $regionIds,$territoryManagerIds);

        $programs = collect([]);

        $factoryTotal = 0;
        foreach ( $claims['factoryClaims'] as $factoryClaim ){
            $claimTotal = $factoryClaim->calculateCurrentTotal();
            $factoryTotal += $claimTotal['total'];

            $program = $factoryClaim->program()->first();
            $programsIndex = $programs->search(function ($item, $key)use($program){
                return $item->id == $program->id;
            });
            if ( $programsIndex !== false  ){
                $programs[$programsIndex]['contributedTotal'] += $claimTotal['total'];
            } else {
                $program->contributedTotal = $claimTotal['total'];
                $programs->push($program);
            }
        }

        $volumeTotal = 0;
        foreach ( $claims['volumeClaims'] as $volumeClaim ){
            $claimTotal = $volumeClaim->calculateCurrentTotal();
            $volumeTotal += $claimTotal['total'];

            $program = $volumeClaim->program()->first();
            $programsIndex = $programs->search(function ($item, $key)use($program){
                return $item->id == $program->id;
            });
            if ( $programsIndex !== false  ){
                $programs[$programsIndex]['contributedTotal'] += $claimTotal['total'];
            } else {
                $program->contributedTotal = $claimTotal['total'];
                $programs->push($program);
            }
        }

        $results = [
            'volumeTotal'=>$volumeTotal,
            'factoryTotal'=>$factoryTotal,
            'contributingPrograms'=>$programs
        ];

        //Period provided, can provide previous period results
        if( isset($year) ) {
            //generate Period Arguments
            if ( isset($quarter) ){
                if( $quarter-1 <= 0 ){
                    $previousYear = $year-1;
                    $previousQuarter = 4;
                } else {
                    $previousYear = $year;
                    $previousQuarter = $quarter-1;
                }
            } else {
                $previousYear = $year-1;
            }

            //Get Claims from new Period
            $claims = self::getClaims($status,$previousYear,(isset($previousQuarter)?$previousQuarter:null),$builderIds,$programIds,$ProductIds, $regionIds,$territoryManagerIds);

//            throw new \Exception(json_encode($claims));

            $previousPrograms = collect([]);

            $previousFactoryTotal = 0;
            foreach ( $claims['factoryClaims'] as $factoryClaim ){
                $claimTotal = $factoryClaim->calculateCurrentTotal();
                $previousFactoryTotal += $claimTotal['total'];

                $program = $factoryClaim->program()->first();
                $programsIndex = $previousPrograms->search(function ($item, $key)use($program){
                    return $item->id == $program->id;
                });
                if ( $programsIndex !== false  ){
                    $previousPrograms[$programsIndex]['contributedTotal'] += $claimTotal['total'];
                } else {
                    $program->contributedTotal = $claimTotal['total'];
                    $previousPrograms->push($program);
                }
            }

            $previousVolumeTotal = 0;
            foreach ( $claims['volumeClaims'] as $volumeClaim ){
                $claimTotal = $volumeClaim->calculateCurrentTotal();
                $previousVolumeTotal += $claimTotal['total'];

                $program = $volumeClaim->program()->first();
                $programsIndex = $previousPrograms->search(function ($item, $key)use($program){
                    return $item->id == $program->id;
                });
                if ( $programsIndex !== false  ){
                    $previousPrograms[$programsIndex]['contributedTotal'] += $claimTotal['total'];
                } else {
                    $program->contributedTotal = $claimTotal['total'];
                    $previousPrograms->push($program);
                }
            }

            $results['previousResults'] = [
                'year'=>$previousYear,
                'quarter'=>(isset($previousQuarter)?$previousQuarter:null),
                'volumeTotal'=>$previousVolumeTotal,
                'factoryTotal'=>$previousFactoryTotal,
                'contributingPrograms'=>$previousPrograms
            ];
        }

//        throw new \Exception(json_encode($results));

        return $results;
    }

    public static function SumClaimsList( $claims, Array $status=null, Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null ){
        $factoryClaims = clone $claims;
        $volumeClaims = clone $claims;

        $factoryClaims->where('claim_type','factory');
        $volumeClaims->where('claim_type','volume');

        if( isset($status) && !empty($status) ) {
            $factoryClaims->whereIn('status',$status);
            $volumeClaims->whereIn('status',$status);
        }

        if( isset($year) ) {
            $factoryClaims->where('report_year',$year);
            $volumeClaims->where('report_year',$year);
        }

        if( isset($quarter) ) {
            $factoryClaims->where('report_quarter',$quarter);
            $volumeClaims->where('report_quarter',$quarter);
        }

        $claims = self::filterClaims($factoryClaims,$volumeClaims,$builderIds,$programIds,$ProductIds, $regionIds,$territoryManagerIds);

        $programs = collect([]);
        $organizations = collect([]);

        $factoryTotal = 0;
        foreach ( $claims['factoryClaims'] as $factoryClaim ){
            $claimTotal = $factoryClaim->calculateCurrentTotal();
            $factoryTotal += $claimTotal['total'];

            foreach ( $claimTotal['builderTotals'] as $builderTotal ){
                $organizationsIndex = $organizations->search(function ($item, $key)use($builderTotal){
                    return $item->id == $builderTotal['builder_id'];
                });
                if ( $organizationsIndex !== false  ){
                    $organizations[$organizationsIndex]['contributedTotal'] += $claimTotal['total'];
                } else {
                    $organization = Organizations::where('id',$builderTotal['builder_id'])->first();
                    $organization->contributedTotal = $claimTotal['total']; //TODO: Not In Schema
                    $organizations->push($organization);
                }
            }

            $program = $factoryClaim->program()->first();
            $programsIndex = $programs->search(function ($item, $key)use($program){
                return $item->id == $program->id;
            });
            if ( $programsIndex !== false  ){
                $programs[$programsIndex]['contributedTotal'] += $claimTotal['total'];
            } else {
                $program->contributedTotal = $claimTotal['total'];
                $programs->push($program);
            }
        }

        $volumeTotal = 0;
        foreach ( $claims['volumeClaims'] as $volumeClaim ){
            $claimTotal = $volumeClaim->calculateCurrentTotal();
            $volumeTotal += $claimTotal['total'];

            foreach ( $claimTotal['builderTotals'] as $builderTotal ){
                $organizationsIndex = $organizations->search(function ($item, $key)use($builderTotal){
                    return $item->id == $builderTotal['builder_id'];
                });
                if ( $organizationsIndex !== false  ){
                    $organizations[$organizationsIndex]['contributedTotal'] += $claimTotal['total'];
                } else {
                    $organization = Organizations::where('id',$builderTotal['builder_id'])->first();
                    $organization->contributedTotal = $claimTotal['total']; //TODO: Not In Schema
                    $organizations->push($organization);
                }
            }

            $program = $volumeClaim->program()->first();
            $programsIndex = $programs->search(function ($item, $key)use($program){
                return $item->id == $program->id;
            });
            if ( $programsIndex !== false  ){
                $programs[$programsIndex]['contributedTotal'] += $claimTotal['total'];
            } else {
                $program->contributedTotal = $claimTotal['total'];
                $programs->push($program);
            }
        }

        return [
            'volumeTotal'=>$volumeTotal,
            'factoryTotal'=>$factoryTotal,
            'contributingPrograms'=>$programs,
            'contributingBuilders'=>$organizations
        ];
    }

    public static function getLastCloseClaim( $claims, Array $status=null, Int $year=null, Int $quarter=null, $builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null )
    {

        $factoryClaims = clone $claims;
        $volumeClaims = clone $claims;

        $factoryClaims->where('claim_type','factory');
        $volumeClaims->where('claim_type','volume');

        if( isset($status) && !empty($status) ) {
            $factoryClaims->whereIn('status',$status);
            $volumeClaims->whereIn('status',$status);
        }

        if( isset($year) ) {
            $factoryClaims->where('report_year',$year);
            $volumeClaims->where('report_year',$year);
        }

        if( isset($quarter) ) {
            $factoryClaims->where('report_quarter',$quarter);
            $volumeClaims->where('report_quarter',$quarter);
        }

        $claims = self::filterClaims($factoryClaims,$volumeClaims,$builderIds,$programIds,$ProductIds, $regionIds,$territoryManagerIds, false);

        $factoryClaims = $claims['factoryClaims']->orderBy('report_year','desc')->orderBy('report_quarter','desc')->first();
        $volumeClaims = $claims['volumeClaims']->orderBy('report_year','desc')->orderBy('report_quarter','desc')->first();

        if ( $factoryClaims && $volumeClaims ){
            if( $volumeClaims->report_year > $factoryClaims->report_year ) {
                return $volumeClaims;
            } else if ($volumeClaims->report_year = $factoryClaims->report_year){
                if( $volumeClaims->report_quarter > $factoryClaims->report_quarter ) {
                    return $volumeClaims;
                } else if ($volumeClaims->report_quarter = $factoryClaims->report_quarter) {
                    return ( $volumeClaims->id > $factoryClaims->id ? $volumeClaims : $factoryClaims );
                } else {
                    return $factoryClaims;
                }
            } else {
                return $factoryClaims;
            }
        } else if ( $factoryClaims ){
            return $factoryClaims;
        } else if ( $volumeClaims ){
            return $volumeClaims;
        }

        return null;
    }

    public static function calculateAllClaimTotal($builderIds=null, $programIds=null, $ProductIds=null, $regionIds=null, $territoryManagerIds=null){
        $claims = self::getClaims(['ready to close','close'],null,null,$builderIds,$programIds,$ProductIds,$regionIds,$territoryManagerIds);
        $allClaims = (clone $claims['factoryClaims'])->merge($claims['volumeClaims']);

        $total = null;
        $programs = collect([]);
        $volumeClaimUsedIds = collect([]);
        $factoryClaimUsedIds = collect([]);

        foreach ( $allClaims as $claim ){
            foreach ($claim->rebateReports as $rebate){
                if ( $claim->claim_type === 'factory' ){

                    //Rebate Amount already added
                    if( $factoryClaimUsedIds->contains($rebate->pivot->id) )continue;
                    $factoryClaimUsedIds->push($rebate->pivot->id);

                    if( $rebate->dispute()->exists() ) {
                        $dispute = $rebate->dispute()->latest()->first();

                        //TODO: $dispute->new_total_allocation what to do if null, fallback?
                        if( isset($dispute->new_total_allocation) ) {
                            (isset($total)
                                ? $total += $dispute->new_total_allocation
                                : $total = $dispute->new_total_allocation
                            );

                            $program = $claim->program()->first();
                            $programsIndex = $programs->search(function ($item, $key) use ($program) {
                                return $item->id == $program->id;
                            });
                            if ($programsIndex !== false) {
                                $programs[$programsIndex]['contributedTotal'] += $dispute->new_total_allocation;
                            } else {
                                $program->contributedTotal = $dispute->new_total_allocation;
                                $programs->push($program);
                            }
                        }
                    } else {

                        //TODO: $rebate->pivot->total_allocation what to do if null, fallback?
                        if( isset($rebate->pivot->total_allocation) ) {
                            (isset($total)
                                ? $total += $rebate->pivot->total_allocation
                                : $total = $rebate->pivot->total_allocation
                            );

                            $program = $claim->program()->first();
                            $programsIndex = $programs->search(function ($item, $key)use($program){
                                return $item->id == $program->id;
                            });
                            if ( $programsIndex !== false  ){
                                $programs[$programsIndex]['contributedTotal'] += $rebate->pivot->total_allocation;
                            } else {
                                $program->contributedTotal = $rebate->pivot->total_allocation;
                                $programs->push($program);
                            }
                        }
                    }

                } elseif ( $claim->claim_type === 'volume' ){
                    $rebateOrgs = $claim->volumeClaimsBuilderRebates()->get();

                    //If no organization found tied to claim, skip to next
                    if(empty($rebateOrgs)) continue;

                    foreach ( $rebateOrgs as $rebateOrg ){
                        //If relation between claim and organization found, skip to next
                        if(!$rebateOrg) continue;

                        //Volume Amount already added
                        if( $volumeClaimUsedIds->contains($rebateOrg->pivot->id) )continue;
                        $volumeClaimUsedIds->push($rebateOrg->pivot->id);

                        if( !$rebateOrg ){
                            //This shouldn't be possible in practice
                            continue;
                        }

                        //TODO: $rebateOrg->pivot->total_allocation what to do if null, fallback?
                        if($rebateOrg->pivot->total_allocation){
                            (isset($total)
                                ? $total += $rebateOrg->pivot->total_allocation
                                : $total = $rebateOrg->pivot->total_allocation
                            );

                            $program = $claim->program()->first();
                            $programsIndex = $programs->search(function ($item, $key)use($program){
                                return $item->id == $program->id;
                            });
                            if ( $programsIndex !== false ){
                                $programs[$programsIndex]['contributedTotal'] += $rebateOrg->pivot->total_allocation;
                            } else {
                                $program->contributedTotal = $rebateOrg->pivot->total_allocation;
                                $programs->push($program);
                            }
                        }
                    }
                }
            }
        }

        return [
            'total'=>round($total, 2),
            'programsAllocation'=>$programs
        ];
    }

    public static function calculateAndSetClaimTotal($claim_rebate_report){

//        Log::info("L509: Starting to do calculateAndSetClaimTotal that might be expensive at ". microtime(true));

        /* Objects and relationships required */
        $claim_rebate_report->load([
            'claim',
                'claim.rebateReports',
                    'claim.rebateReports.rebateReports',
                        'claim.rebateReports.rebateReports.organization',
                    'claim.rebateReports.houses',
                    'claim.rebateReports.products',
                        'claim.rebateReports.products.programs',
                        'claim.rebateReports.products.customization',
            'rebateReport',
            'rebateReport.houses',
            'rebateReport.products',
                'rebateReport.products.programs',
                'rebateReport.products.customization',
            'rebateReport.rebateReports',
                'rebateReport.rebateReports.organization',
            'rebateReport.dispute']);

        $claim = $claim_rebate_report->claim;
        if(!$claim) {
            throw new \Exception('Failed to find associated claim during claim-rebate report save event.');
        }

        if( $claim->status == 'close' || $claim->status == 'ready to close' ){
            throw new \Exception('Closed claims are immutable.');
        }

        $rebateReportPivot = $claim_rebate_report->rebateReport; //RebateReportsHousesProducts
        if(!$rebateReportPivot) {
            throw new \Exception('Failed to find parent claim rebate report during save event.');
        }

//        $rebatesHouseProductOfReport = RebateReportsHousesProducts::where('rebateReport_id',$rebateReportPivot->rebateReport_id)->get();
//        $rebatesHouseProductOfReport = RebateReportsHousesProducts::whereHas('claims',function($query)use($claim_rebate_report){
//            $query->where('claims.id',$claim_rebate_report->claim_id);
//        })->get();
        $rebatesHouseProductOfReport = $claim_rebate_report->claim->rebateReports; //RebateReportsHousesProducts

        //TODO: figure a way to reduce this.
            //todo: use claim_rebate_report where all claim_id is same instead
        //NOTE: $rebatesHouseProductOfReport is not just the rebateReport Connected, but all rebateReportHouseProduct which has a matching rebateReport_id
        //QUestion: A) if the rebate report is already approved and claim, do we need to re-run this command?


        if($rebateReportPivot->rebateReports === null) throw new \Exception('Failed to find reports through pivot.');
        $rebateReport = $rebateReportPivot->rebateReports;
        if(!$rebateReport) throw new \Exception('Failed to find reports through pivot.');

        $organization = $rebateReport->organization;
        if(!$organization) {
            throw new \Exception('Claim rebate report save event without a valid organization.');
        }

//        Log::info("L540: calculateAndSetClaimTotal simple gets that might be expensive at ". microtime(true));

        $rebate_report_id = $rebateReport->id;
        $conversions = ConversionHelpers::conversionRevenue();

//        Log::info("L545: calculateAndSetClaimTotal ConversionRevenue gets that might be expensive at ". microtime(true));


        /* Values we are accumulating */
        $reporting = [];
        $builder_allocation = 0;
        $total_allocation = 0;

        //NOTE: $rebatesHouseProductOfReport is not just the rebateReport Connected, but all rebateReportHouseProduct which has a matching rebateReport_id
        //QUestion: A) if the rebate report is already approved and claim, do we need to re-run this command?
        foreach ($rebatesHouseProductOfReport as $rebate){ //TODO: generateReport loops a lot, there are query in it
//            Log::info("L554: calculateAndSetClaimTotal pre generateReport gets that might be expensive at ". microtime(true));

            $report = $rebate->generateReport($conversions,$rebate);
            $house_id = $rebate->house_id;

//            Log::info("L559: calculateAndSetClaimTotal post generateReport gets that might be expensive at ". microtime(true));


            if(isset($reporting[$rebate_report_id][$house_id])) {
                continue;
            }

            $reporting[$rebate_report_id][$house_id] = $report;

            if(isset($report["totals"]["by_builder"][$organization->id])) {
                $claim_rebate_report->builder_allocation = $report["totals"]["by_builder"][$organization->id]["total"];
            }

            $claim_rebate_report->total_allocation = $report["totals"]['base']["total"];

            $total_allocation += $report["totals"]["base"]["total"];
        }

        /*
         * Until this point, all of our operations have been read-only.
         *
         * Updating a claim rebate report and its associated claim total is intended to be an
         * "atomic" operation and should always be coupled; we use a transaction to achieve this.
         */


        //TODO: times out before this
//        Log::info("573: Starting first transaction do calculateAndSetClaimTotal that might be expensive at ". microtime(true));


        DB::beginTransaction();
        try {
            /* Update the associated claim's report_total field. */
            $claim->report_total = $total_allocation; //Incorrect, neither the old house (which would report too much), nor the new RebateReportsHousesProducts (which reports too little) would cover this, TODO: move to claim loop through relation and calculate
            $claim->save();

            /*
            * We'll include an extra property to flag this save as having originated within a "side effect"
            * of another save() call.  We do this to prevent an infinite loop when we write back the expected
            * values into the originating report model for this event.
            */
            $claim_rebate_report->save([
                "side_effect" => true
            ]);
            DB::commit();
        } catch(\Exception $ex) {
           DB::rollBack();

            Log::error($ex->getMessage());
        }

//        Log::info("597: Starting second transaction do calculateAndSetClaimTotal that might be expensive at ". microtime(true));

        DB::beginTransaction();
        try {
            /* Update the associated claim's report_total field. */
            $calculateClaimCurrentTotal = $claim->calculateCurrentTotal();

            $claim->report_total = $calculateClaimCurrentTotal['total'];
            $claim->save();

            DB::commit();
        } catch(\Exception $ex) {
            DB::rollBack();

            Log::error($ex->getMessage());
        }

//        Log::info("L609: ended to do calculateAndSetClaimTotal that might be expensive at ". microtime(true));
    }

    public static function builderClaimTotal($claims, $organizationId){

        $claims = $claims
            ->with(['rebateReports','rebateReports.rebateReports'])
            ->get();

        $factoryTotal = null;
        $volumeTotal = null;
        $programs = collect([]);
        $volumeClaimUsedIds = collect([]);
        $factoryClaimUsedIds = collect([]);

        foreach ( $claims as $claim ){
            foreach ($claim->rebateReports as $rebate){
                if( $rebate->rebateReports->organization_id == $organizationId ){
                    if ( $claim->claim_type === 'factory' ){

                        //Rebate Amount already added
                        if( $factoryClaimUsedIds->contains($rebate->pivot->id) )continue;
                        $factoryClaimUsedIds->push($rebate->pivot->id);

                        if( $rebate->dispute()->exists() ) {
                            $dispute = $rebate->dispute()->latest()->first();

                            //TODO: $dispute->new_total_allocation what to do if null, fallback?
                            if( isset($dispute->new_total_allocation) ) {
                                (isset($factoryTotal)
                                    ? $factoryTotal += $dispute->new_total_allocation
                                    : $factoryTotal = $dispute->new_total_allocation
                                );

                                $program = $claim->program()->first();
                                $programsIndex = $programs->search(function ($item, $key)use($program){
                                    return $item->id == $program->id;
                                });
                                if ( $programsIndex !== false  ){
                                    $programs[$programsIndex]['contributedTotal'] += $dispute->new_total_allocation;
                                } else {
                                    $program->contributedTotal = $dispute->new_total_allocation;
                                    $programs->push($program);
                                }
                            }
                        } else {

                            //TODO: $rebate->pivot->total_allocation what to do if null, fallback?
                            if( isset($rebate->pivot->total_allocation) ) {
                                (isset($factoryTotal)
                                    ? $factoryTotal += $rebate->pivot->total_allocation
                                    : $factoryTotal = $rebate->pivot->total_allocation
                                );

                                $program = $claim->program()->first();
                                $programsIndex = $programs->search(function ($item, $key)use($program){
                                    return $item->id == $program->id;
                                });
                                if ( $programsIndex !== false  ){
                                    $programs[$programsIndex]['contributedTotal'] += $rebate->pivot->total_allocation;
                                } else {
                                    $program->contributedTotal = $rebate->pivot->total_allocation;
                                    $programs->push($program);
                                }
                            }
                        }

                    } elseif ( $claim->claim_type === 'volume' ){
                        $rebateOrg = $claim->volumeClaimsBuilderRebates()
                            ->where('organizations.id',$organizationId)
                            ->first();

                        //If relation between claim and organization found, skip to next
                        if(!$rebateOrg) continue;

                        //Volume Amount already added
                        if( $volumeClaimUsedIds->contains($rebateOrg->pivot->id) )continue;
                        $volumeClaimUsedIds->push($rebateOrg->pivot->id);

                        if( !$rebateOrg ){
                            //This shouldn't be possible in practice
                            continue;
                        }

//                        var_dump( 'volumeClaimsBuilderRebates ' . $rebateOrg->pivot->id . ' added to '. $orgId);

                        (isset($volumeTotal)
                            ? $volumeTotal += $rebateOrg->pivot->total_allocation
                            : $volumeTotal = $rebateOrg->pivot->total_allocation
                        );

                        $program = $claim->program()->first();
                        $programsIndex = $programs->search(function ($item, $key)use($program){
                            return $item->id == $program->id;
                        });
                        if ( $programsIndex !== false ){
                            $programs[$programsIndex]['contributedTotal'] += $rebateOrg->pivot->total_allocation;
                        } else {
                            $program->contributedTotal = $rebateOrg->pivot->total_allocation;
                            $programs->push($program);
                        }
                    }
                }
            }
        }

        return [
            'total'=>$volumeTotal+$factoryTotal,
            'volumeTotal'=>$volumeTotal,
            'factoryTotal'=>$factoryTotal,
            'contributingPrograms'=>$programs
        ];
    }
}
