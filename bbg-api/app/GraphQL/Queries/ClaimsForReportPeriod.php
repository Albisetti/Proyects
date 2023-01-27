<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;

class ClaimsForReportPeriod
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $claims = Claims::where('report_year',$args['year'])->where('report_quarter',$args['quarter']);
        return $claims;
    }
}
