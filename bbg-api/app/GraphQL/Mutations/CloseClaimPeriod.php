<?php

namespace App\GraphQL\Mutations;

use App\Models\Claims;

class CloseClaimPeriod
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver

        try {
            return Claims::closeClaimPeriod($args['year'],$args['quarter']);
        } catch (\Exception $ex){
            throw $ex;
        }
    }
}
