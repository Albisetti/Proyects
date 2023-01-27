<?php

namespace App\GraphQL\Queries;

use App\Models\RebateReportsHousesProducts;

class ReadiedRebatesCount
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        return RebateReportsHousesProducts::readiedRebatesCount();
    }
}
