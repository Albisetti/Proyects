<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\ProgramParticipants;

class RecentlyAdoptedPrograms
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

        if($user->type == 'admin') {
			$results = (new ProgramParticipants())
				->load(['program', 'builder'])
				->limit(10)
				->get();
			$response = [];

			foreach($results as $result) {
				$response[] = [
					"program" => $result->program,
					"organization" => $result->builder
				];
			}

			return $response;
        }

        $managedStates = $user->managedStates()->pluck('iso_code')->all();
        $buildersApprovedStates = ($userOrg ? $userOrg->approved_states()->pluck('iso_code')->all():[]);

        $CanadaRegionApproved = collect($managedStates);
        if(!empty($buildersApprovedStates))$CanadaRegionApproved = $CanadaRegionApproved->merge(collect($buildersApprovedStates));
        $CanadaRegionApproved = $CanadaRegionApproved->contains(function ($value,$key){
            return substr($value, 0, 3) === 'CA-';
        });

        $USRegionApproved = collect($managedStates);
        if(!empty($buildersApprovedStates)) $USRegionApproved = $USRegionApproved->merge(collect($buildersApprovedStates));
        $USRegionApproved = $USRegionApproved->contains(function ($value,$key){
            return substr($value, 0, 3) === 'US-';
        });

        if( empty($buildersApprovedStates) && !$userOrg ) return \App\Models\Programs::where('id',-1);

        $programs = \App\Models\Programs::where(function ($query)use($userOrg,$buildersApprovedStates,$managedStates,$CanadaRegionApproved,$USRegionApproved) {
            if(!empty($buildersApprovedStates)){
                $query->where(function ($query) use ($buildersApprovedStates) {
                    $query->where('valid_region_type', 'Custom')
                        ->whereHas('regions', function ($query) use ($buildersApprovedStates) {
                            $query->whereIn('iso_code', $buildersApprovedStates);
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
        })
            ->orWhereHas('participants',function ($query) use ($userOrg){
                $query->where('organizations.id',$userOrg->id);
            })
        ;

		$results = $programs->limit(10)->get();
		$response = [];

		foreach($results as $result) {
			$response[] = [
				"program" => $result,
				"organization" => $userOrg
			];
		}

		return $response;
    }
}
