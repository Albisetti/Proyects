<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;

class GetPeriodsListFromClaims
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver

        if ( !isset($args['ids']) || empty($args['ids']) ) return [];

        try {
            $claims = Claims::whereIn('id',$args['ids'])->get();
//            throw new \Exception(json_encode($claims));
            $periods = Claims::extractUniqueClaimPeriod($claims);
        } catch (\Exception $ex){
            throw $ex;
        }

        return $periods;
    }
}
