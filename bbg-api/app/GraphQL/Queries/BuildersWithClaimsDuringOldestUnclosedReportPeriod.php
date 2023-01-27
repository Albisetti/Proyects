<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;
use Illuminate\Support\Facades\Log;

class BuildersWithClaimsDuringOldestUnclosedReportPeriod
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $oldestPeriod = Claims::getOldestOpenClaimPeriod();

        if( !isset($oldestPeriod) || empty($oldestPeriod) || !isset($oldestPeriod['year']) || !isset($oldestPeriod['year']) ){
            return [
                'error'=>'No Open Claim Period'
            ];
        }

        $organizations = collect([]);
        $closeOrganizations = collect([]);

        $claims = Claims::
        where('report_year',$oldestPeriod['year'])
            ->where('report_quarter',$oldestPeriod['quarter'])
            ->where('status','ready to close')
            ->with(['rebateReports','rebateReports.rebateReports','rebateReports.rebateReports.organization','volumeClaimsBuilderRebates'])
            ->get();

        foreach ( $claims as $claim ){
            $submittedRebates = $claim->rebateReports;

            foreach ( $submittedRebates as $submittedRebate ) {
                if(!isset($submittedRebate->rebateReports)||empty($submittedRebate->rebateReports)
                    ||!isset($submittedRebate->rebateReports->organization)||empty($submittedRebate->rebateReports->organization)
                ){
                    //NO ORG, cannot continue with this rebate
                    Log::error($submittedRebate->id . " cannot identify rebateReports or organization");
                    continue;
                }
                $org = $submittedRebate->rebateReports->organization;

                if(
                    isset($submittedRebate->pivot->approved_at)
                    && !$organizations->contains('id',$org->id)
                ) {

                    $total = $org->calculateClaimTotal($oldestPeriod['quarter'],$oldestPeriod['year']);

                    $closeOrganizations[$org->id] = [
                                'builder'=>$org,
                                'total'=>$total
                        ];
                } else {

                    if( isset($closeOrganizations[$org->id]) ) unset($closeOrganizations[$org->id]);
                    $organizations = $organizations->push($org);
                }
            }

            $volumeBuilders = $claim->volumeClaimsBuilderRebates;
            foreach ( $volumeBuilders as $volumeBuilder ) {
                if ( isset($volumeBuilder->pivot->approved_at) && !$organizations->contains('id',$volumeBuilder->id) ){
                    $total = $volumeBuilder->calculateClaimTotal($oldestPeriod['quarter'],$oldestPeriod['year']);

                    $closeOrganizations[$volumeBuilder->id] = [
                        'builder'=>$volumeBuilder,
                        'total'=>$total
                    ];
                } else {
                    if( isset($closeOrganizations[$volumeBuilder->id]) ) unset($closeOrganizations[$volumeBuilder->id]);
                    $organizations = $organizations->push($volumeBuilder);

                }
            }
        }

        if ( !empty($oldestPeriod['quarter']) && !empty($oldestPeriod['year']) ){
            $period = '';
            if(isset($oldestPeriod['quarter']) && !empty($oldestPeriod['quarter'])) $period .= 'Q'.$oldestPeriod['quarter'];
            if(
                isset($oldestPeriod['quarter']) && !empty($oldestPeriod['quarter']) &&
                isset($oldestPeriod['year']) && !empty($oldestPeriod['year'])
            ) $period .= ' ';
            if(isset($oldestPeriod['year']) && !empty($oldestPeriod['year'])) $period .= $oldestPeriod['year'];
        }

        return [
            'year' => $oldestPeriod['year'],
            'quarter' => $oldestPeriod['quarter'],
            'report_period' => $period,
            'uncloseBuilders' => $organizations->unique('id'),
            'closeBuilders' => $closeOrganizations
        ];
    }
}
