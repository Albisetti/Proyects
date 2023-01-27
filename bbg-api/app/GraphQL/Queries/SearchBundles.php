<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use MeiliSearch\Endpoints\Indexes;

class SearchBundles
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

        $filter = false;

        switch ($user->type){
            case 'builders':
                $org_id = ( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
                $filter = 'organization_id = ' . $org_id;
                break;
            case 'territory_managers':
                $managedOrganizations = ( $user->managedOrganizations()->exists() ? $user->managedOrganizations()->pluck('organizations.id')->all() : [-1]);
                $filter = '(organization_id = ' . implode( ' OR organization_id = ', $managedOrganizations ) . ')';
                break;
            default:
                //admin as access to all, don't apply filter
                break;
        }

        $bundles = \App\Models\Bundles::search($args['search'],function (Indexes $meilisearch, $query, $options) use ($filter) {
            if( $filter ) $options['filter'] = $filter;
            return $meilisearch->search($query, $options);
        });
        return $bundles;
    }
}
