<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\Organizations;
use Exception;

class BuildersWithoutBundles
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

		$query = Organizations::query();
		if($user->type === 'admin') {
			$query->whereDoesntHave('bundles')
				->where('organization_type', '=', 'builders');
		} else if($user->type === 'territory_managers' || $user->type === 'builders') {
			$organization_ids = AuthHelpers::listAccessibleOrganizations($user);
			
			$query->whereIn('id', $organization_ids)
				->whereDoesntHave('bundles')
				->where('organization_type', '=', 'builders');
		} else {
			throw new Exception('Trying to request builders without bundles as an unexpected user type.');
		}

		return $query;
    }
}
