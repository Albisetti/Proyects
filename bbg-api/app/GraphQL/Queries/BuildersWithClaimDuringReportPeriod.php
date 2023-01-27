<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;
use App\Models\RebateReportsHousesProducts;

class BuildersWithClaimDuringReportPeriod
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $organizations = collect([]);

        $claims = Claims::
        where('report_year',$args['year'])
            ->where('report_quarter',$args['quarter'])
            ->where('status','ready to close')
        ->get();

        foreach ( $claims as $claim ){
            $submittedRebates = $claim->rebateReports()->with(['rebateReports'])->get();
            foreach ( $submittedRebates as $submittedRebate ) {
                $organizations = $organizations->merge($submittedRebate->rebateReports->organization()->get());
                break;
            }
        }

        $closeClaims = Claims::
        where('report_year',$args['year'])
            ->where('report_quarter',$args['quarter'])
            ->where('status','close')
            ->get();

        foreach ($organizations as $key=>$organization){
            if( $closeClaims->contains('id',$organization->id )){
                $organizations->forget($key);
            }
        }

        return $organizations;
    }
}
