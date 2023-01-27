<?php

namespace App\GraphQL\Queries;

use App\Http\Controllers\UtilityController;
class AllocationCsv
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        if ( isset($args['year']) && isset($args['quarter']) ){
            return UtilityController::generateAllocationSpreadsheet($args['year'],$args['quarter']);
        }else{
            return UtilityController::generateAllocationSpreadsheet();
        }
    }
}
