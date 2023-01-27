<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\Programs;
use MeiliSearch\Endpoints\Indexes;

class SearchClaimablePrograms
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
            $organizations = $user->organizations()->get();
        } catch (\Exception $ex){
            throw $ex;
        }

        $approvedState = collect([]);

        if($user->managedOrganizations()->exists()){
            $managedOrganizations = $user->managedOrganizations()->get();
            $organizations = $organizations->merge($managedOrganizations);

            $managedStates = $user->managedStates()->pluck('iso_code')->all();
            $approvedState = $approvedState->merge($managedStates);
        }

        foreach ($organizations as $organization){
            $buildersApprovedStates = $organization->approved_states()->pluck('iso_code')->all();
            $approvedState = $approvedState->merge($buildersApprovedStates);
        }

        if(count($approvedState)>=1){
            $buildersApprovedStatesFacetString = 'iso_codes = ' . implode( ' OR iso_codes = ',$approvedState->toArray());
        }else{
            $buildersApprovedStatesFacetString = 'iso_codes = -1';
        }
        $CanadaRegionApproved = collect($approvedState)->contains(function ($value,$key){
            return substr($value, 0, 3) === 'CA-';
        });
        $USRegionApproved = collect($approvedState)->contains(function ($value,$key){
            return substr($value, 0, 3) === 'US-';
        });

        $filter = null;
        if($user->type !== 'admin') {
            $filter = '';
            if( $CanadaRegionApproved || $USRegionApproved ) $filter .= '(';
            $filter .= '(valid_region_type = Custom';
            $filter .= ' AND (' . $buildersApprovedStatesFacetString . ')';
            $filter .= ')';
            if( $CanadaRegionApproved ) $filter .= ' OR (valid_region_type = CA OR valid_region_type = \'US And CA\')';
            if( $USRegionApproved ) $filter .= ' OR (valid_region_type = US OR  valid_region_type = \'US And CA\')';
            if( $CanadaRegionApproved || $USRegionApproved ) $filter .= ')';

            if( !empty($organizationIds = $organizations->pluck('id')->toArray()) ){
                $participants = 'active_participants = ' . implode( ' OR active_participants = ', $organizations->pluck('id')->toArray() );
                $filter .= ' OR ('.$participants.')';
            }
        }

        $programs = Programs::search($args['search'], function (Indexes $meilisearch, $query, $options) use ($filter) {
            $options['sort'] = ['name:asc'];

            $options['filter'] = '';
            if(isset($filter)) $options['filter'] .= '('.$filter .') AND ';
            $options['filter'] .= 'claimable=true';
            return $meilisearch->search($query, $options);
        });

        return $programs;
    }
}
