<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;

class Disputes
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

        $disputes = (new \App\Models\Disputes())->newQuery();
        if( $user->type !== "admin" ) $disputes = $disputes->whereIn('organization_id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));

        return $disputes;
    }
}
