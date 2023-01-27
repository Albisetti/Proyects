<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use MeiliSearch\Endpoints\Indexes;

class SearchOrganizationsWithRebate
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

        $organizations = \App\Models\Organizations::search((isset($args['search'])?$args['search']:''), function (Indexes $meilisearch, $query, $options) use ($args,$user) {

            $options['filter'] = '(organization_type = builders)';

            if( isset($args['status']) && !empty($args['status']) ){
                $options['filter'] .= ' AND (';
                foreach ($args['status'] as $index =>$status){
                    if($index >=1) $options['filter'] .= ' OR ';

                    switch ($status){
                        case 'action required':
                            $options['filter'] .= 'hasActionRequireRebate = true';
                            break;
                        case 'rebate ready':
                            $options['filter'] .= 'hasReadiedRebate = true';
                            break;
                        case 'completed':
                            $options['filter'] .= 'hasCompletedRebate = true';
                            break;
                        default:
                    }
                }
                $options['filter'] .= ')';
            }

            if($user->type !== 'admin'){
                $options['filter'] .= ' AND (';
                $options['filter'] .= 'users = '.$user->id;
                if($user->managedOrganizations()->exists()) $options['filter'] .= ' OR territoryManagers = '.$user->id;
                $options['filter'] .= ')';
            }

            return $meilisearch->search($query, $options);
        });

        return $organizations;
    }
}
