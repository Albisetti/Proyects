<?php

namespace App\GraphQL\Queries;

class CalculateClaimTotal
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            return \App\Models\Organizations::findOrFail($args['orgId'])->calculateClaimTotal($args['quarter'],$args['year']);
        } catch ( \Exception $ex) {
            throw $ex;
        }
    }
}
