<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use MeiliSearch\Endpoints\Indexes;

class SearchOrganizations
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

        $organizations = \App\Models\Organizations::search($args['search'], function (Indexes $meilisearch, $query, $options) use ($args,$user) {

            if($user->type !== 'admin'){
                $options['filter'] = '(';
                $options['filter'] .= 'users = '.$user->id;
                if($user->managedOrganizations()->exists()) $options['filter'] .= ' OR territoryManagers = '.$user->id;
                $options['filter'] .= ')';
            }

            if( isset($args['organization_type']) && !empty($args['organization_type']) ) {
                if(!isset($options['filter']))$options['filter'] = '';
                if($user->type !== 'admin') $options['filter'] .= ' AND ';
                $options['filter'] .= '(organization_type=' . implode(' OR organization_type=', $args['organization_type']).')';
            }

            return $meilisearch->search($query, $options);
        });

        return $organizations;
    }
}
