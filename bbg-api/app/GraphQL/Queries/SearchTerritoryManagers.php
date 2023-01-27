<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use MeiliSearch\Endpoints\Indexes;

class SearchTerritoryManagers
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

        $users = \App\Models\User::search(
	    (isset($args['search'])?$args['search']:''),
	    function (Indexes $meilisearch, $query, $options)use($user) {

            if($user->type !== 'admin'){
                $organizationIds = AuthHelpers::listAccessibleOrganizations($user);
                $options['filter'] = '(';
                $options['filter'] .= 'id = '.$user->id . ' OR ';
                if (!$organizationIds->isEmpty())
                    $options['filter'] .= 'organization_id = ' . implode(' OR organization_id = ', $organizationIds->toArray());
                $options['filter'] .= ') AND ';
            }

                if(!isset($options['filter']))$options['filter']='';
                $options['filter'] .= 'type=territory_managers';

            	return $meilisearch->search($query, $options);
	    }
	);

        return $users;
    }
}
