<?php

namespace App\GraphQL\Mutations;

use App\Models\Organizations;

class ApproveReadyToCloseClaims
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            $results = Organizations::approveReadyToCloseClaims($args['org_id'],$args['quarter'],$args['year']);
        } catch ( \Exception $ex ) {
            throw $ex;
        }

        return $results;
    }
}
