<?php

namespace App\GraphQL\Queries;

use App\Http\Controllers\UtilityController;

class FactoryClaimsCsv
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        return UtilityController::generateFactoryClaimsSpreadsheet();
    }
}
