<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;

class OrganizationsWithRebate
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

        $organizations = (new \App\Models\Organizations)->newQuery();
        $organizations->orWhere('organization_type', 'builders');

        if( isset($args['status']) ){
            $WhoseStatusIs = $args['status'];
            $organizations->whereHas('rebateReports',function ($query)use($WhoseStatusIs){
                $query->whereHas('rebates',function ($query)use($WhoseStatusIs){
                    $query->whereIn('status',$WhoseStatusIs);
                });
            });
        }

        switch ($user->type){
            case 'builders':
            case 'territory_managers':
                $organizationIds = AuthHelpers::listAccessibleOrganizations($user);
                $organizations->whereIn('id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));
                break;
            case 'admin':
            case 'executive':
            default:
                break;
        }

        return $organizations;
    }
}
