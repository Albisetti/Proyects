<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;

class Subcontractors
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

        $subcontractors = (new \App\Models\SubContractors())->newQuery();

        if( $user->type !== 'admin' ){
            $organizationIds = AuthHelpers::listAccessibleOrganizations($user);
            $subcontractors->whereHas('organizations',function ($query)use($organizationIds){
                if(!empty($organizationIds)){
                    $query->whereIn('organizations.id',$organizationIds->toArray());
                } else {
                    $query->whereIn('organizations.id',-1);
                }
            });
        }

        return $subcontractors;
    }
}
