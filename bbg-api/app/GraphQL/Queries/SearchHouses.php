<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use MeiliSearch\Endpoints\Indexes;

class SearchHouses
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

        $houses = \App\Models\Houses::search($args['search'], function (Indexes $meilisearch, $query, $options)use($organizationIds){
            $options['filter'] = '(organization_id = ' . implode( ' OR organization_id = ', (!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]) ).')';
            $options['filter'] .= 'OR ( subdivision_organization_id = '. implode( ' OR subdivision_organization_id = ', (!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]) ).')';
            return $meilisearch->search($query, $options);
        });
        return $houses;
    }
}
