<?php

namespace App\GraphQL\Queries;

use App\Models\RebateReportsHousesProducts;

class ActionNeededRebate
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        return RebateReportsHousesProducts::actionRequiredRebatesCount();
    }
}
