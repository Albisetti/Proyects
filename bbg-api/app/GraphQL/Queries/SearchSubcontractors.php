<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use MeiliSearch\Endpoints\Indexes;

class SearchSubcontractors
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

        $subcontractors = \App\Models\SubContractors::search($args['search'], function (Indexes $meilisearch, $query, $options) use ($user) {

//            if( $user->type !== 'admin' ) {
//                $organizationIds = AuthHelpers::listAccessibleOrganizations($user);
//                if (!$organizationIds->isEmpty())
//                    $options['filter'] = 'organizations = ' . implode(' OR organizations = ', $organizationIds->toArray());
//            }

            return $meilisearch->search($query, $options);
        });

        return $subcontractors;
    }
}
