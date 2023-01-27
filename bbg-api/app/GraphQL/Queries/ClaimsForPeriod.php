<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;

class ClaimsForPeriod
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $organizations = Claims::claimsWithinPeriod($args['year'],$args['quarter']);
        return $organizations;
    }
}
