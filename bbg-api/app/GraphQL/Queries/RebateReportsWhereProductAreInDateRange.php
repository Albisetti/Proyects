<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\RebateReports;
use App\Models\RebateReportsHousesProducts;

class RebateReportsWhereProductAreInDateRange
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $argCollection = collect($args);

        try {
            $whoAmI = AuthHelpers::whoAmI();
            $user = AuthHelpers::extractUserFromWhoAmI($whoAmI);
        } catch (\Exception $ex){
            throw $ex;
        }


        $rebateReport = (new RebateReports())->newQuery();
        if($user->type !== 'admin'){
            $organizationIds = AuthHelpers::listAccessibleOrganizations($user);
            $rebateReport->whereIn('organization_id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));
        }

        $rebateReport = $rebateReport->whereHas('rebates',function ($query)use($argCollection){
            $query->whereBetween('created_at', [$argCollection['startDate'], $argCollection['endDate']]);
        });

        return $rebateReport;
    }
}
