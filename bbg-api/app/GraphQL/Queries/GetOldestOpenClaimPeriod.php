<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;

class GetOldestOpenClaimPeriod
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        try {
            return Claims::getOldestOpenClaimPeriod();
        } catch (\Exception $ex) {
            throw $ex;
        }
    }
}
