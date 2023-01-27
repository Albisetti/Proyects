<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;

class Bundles
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

        $bundles = (new \App\Models\Bundles())->newQuery();
        $bundles->whereHas('organization',function ($query)use($organizationIds){
            $query->whereIn('id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));

        });
        return $bundles;
    }
}
