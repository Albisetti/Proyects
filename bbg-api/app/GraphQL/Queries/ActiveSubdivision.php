<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\SubDivision;

class ActiveSubdivision
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            $whoAmI = AuthHelpers::whoAmI();
            $user = AuthHelpers::extractUserFromWhoAmI($whoAmI);
        } catch (\Exception $ex){
            throw $ex;
        }

        $organizationIds = AuthHelpers::listAccessibleOrganizations($user);

        $subdivisions = SubDivision::has('houses')->whereHas('organization',function ($query)use($organizationIds){
            $query->whereIn('id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));
        });
        return $subdivisions;
    }
}
