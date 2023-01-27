<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use MeiliSearch\Endpoints\Indexes;

class SearchEligibleBuilder
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

        $program = \App\Models\Programs::where('id', $args['program_id'])->first();
        if( !$program ) throw new \Exception('No Program Found');

        $organizations = \App\Models\Organizations::search($args['search'], function (Indexes $meilisearch, $query, $options) use ($args,$user,$program) {

            if($user->type !== 'admin'){
                $options['filter'] = '(';
                $options['filter'] .= 'users = '.$user->id;
                if($user->managedOrganizations()->exists()) $options['filter'] .= ' OR territoryManagers = '.$user->id;
                $options['filter'] .= ')';
            }

            if( $program ) {
                if(!isset($options['filter']))$options['filter'] = '';
                if($user->type !== 'admin') $options['filter'] .= ' AND ';
                $options['filter'] .= '(participatingPrograms =' . $program->id;

                switch ($program->valid_region_type) {
                    case 'US And CA':
                        //Available everywhere
                        $options['filter'] .= ' OR (CanadaApproved = true OR USApproved = true)';
                        break;
                    case 'US':
                        $options['filter'] .= ' OR (USApproved = true)';
                        break;
                    case 'CA':
                        $options['filter'] .= ' OR (CanadaApproved = true)';
                        break;
                    case 'Custom':
                    default:
                        if( $program->regions()->exists() ) {
                            $programRegions = $program->regions()->pluck('iso_code')->toArray();
                            $options['filter'] .= ' OR (approvedStates=' . implode(' OR approvedStates=', $programRegions).')';
                        }
                        break;
                }

                $options['filter'] .= ')';
            }

            return $meilisearch->search($query, $options);
        });

        return $organizations;
    }
}
