<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;

class RebateReports
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

        $rebateReport = (new \App\Models\RebateReports())->newQuery();
        if($user->type !== 'admin'){
            $organizationIds = AuthHelpers::listAccessibleOrganizations($user);
            $rebateReport->whereIn('organization_id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));
        }

        return $rebateReport;
    }
}
