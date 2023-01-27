<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;

class DistinctReportPeriodForCloseClaims
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        try {
            return Claims::distinctReportPeriodForCloseClaims();
        } catch (\Exception $ex) {
            throw $ex;
        }
    }
}
