<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;

class DistinctClaimReportPeriod
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            return Claims::distinctReportPeriod();
        } catch (\Exception $ex) {
            throw $ex;
        }
    }
}
