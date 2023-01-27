<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;

class Programs
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
            $userOrg = $user->organizations()->first();
        } catch (\Exception $ex){
            throw $ex;
        }

        if($user->type == 'admin'){
            $programs = (new \App\Models\Programs())->newQuery();

            if ( isset($args['programType']) && !empty($args['programType']) )
                $programs->whereIn('type',$args['programType']);

            return $programs;
        }

        $managedStates = $user->managedStates()->pluck('iso_code')->all();
        $organizationApprovedStates = ($userOrg ? $userOrg->approved_states()->pluck('iso_code')->all():[]);

        if ( $user->type == 'territory_managers' ){
            $managedOrgs = $user->managedOrganizations()->get();
            $managedOrgIds = $managedOrgs->pluck('id')->toArray();

            if(empty($managedStates) && empty($organizationApprovedStates) && empty($managedOrgs) ) return \App\Models\Programs::where('id',-1);
        } else {
            $managedOrgIds = null;
        }

        if(empty($managedStates) && empty($organizationApprovedStates) ) return \App\Models\Programs::where('id',-1);

        $CanadaRegionApproved = collect($managedStates);
        if(!empty($organizationApprovedStates))$CanadaRegionApproved = $CanadaRegionApproved->merge(collect($organizationApprovedStates));
        $CanadaRegionApproved = $CanadaRegionApproved->contains(function ($value,$key){
            return substr($value, 0, 3) === 'CA-';
        });

        $USRegionApproved = collect($managedStates);
        if(!empty($organizationApprovedStates)) $USRegionApproved = $USRegionApproved->merge(collect($organizationApprovedStates));
        $USRegionApproved = $USRegionApproved->contains(function ($value,$key){
            return substr($value, 0, 3) === 'US-';
        });

        $programs = \App\Models\Programs::where(function ($query)use($userOrg,$organizationApprovedStates,$managedStates,$CanadaRegionApproved,$USRegionApproved, $managedOrgIds) {

            if(!empty($organizationApprovedStates)){
                $query->where(function ($query) use ($organizationApprovedStates) {
                    $query->where('valid_region_type', 'Custom')
                        ->whereHas('regions', function ($query) use ($organizationApprovedStates) {
                            $query->whereIn('iso_code', $organizationApprovedStates);
                            if(isset($managedStates)) $query->whereIn('iso_code',$managedStates);
                        });
                });
            }

            if ( $CanadaRegionApproved || $USRegionApproved ) {
                $query->orWhere(function ($query) {
                    $query->where('valid_region_type', 'US And CA');
                });
            }

            if ( $USRegionApproved ) {
                $query->orWhere(function ($query) {
                    $query->where('valid_region_type', 'US');
                });
            }

            if ( $CanadaRegionApproved ) {
                $query->orWhere(function ($query){
                    $query->where('valid_region_type', 'CA');
                });
            }

            if (isset($userOrg)&&$userOrg) {
                $query->orWhereHas('participants',function ($query)use($userOrg){
                    $query->where('organizations.id',$userOrg->id);
                });
            }

            if ( isset($managedOrgIds) && $managedOrgIds ){
                $query->orWhereHas('participants',function ($query)use($managedOrgIds){
                    $query->whereIn('organizations.id',$managedOrgIds);
                });
            }
        })
        ;

        if ( isset($args['programType']) && !empty($args['programType']) )
            $programs->whereIn('type',$args['programType']);

        return $programs;
    }
}
