<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\User;
use Exception;

class LatestTerritoryManager
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

		if($user->type !== 'admin') {
			throw new Exception('Unauthorized user ID ' . $user->id . ' asking for latest territory manager.');
		}

		return User::where('type', 'territory_managers')
			->orderBy('created_at', 'desc')
			->first();
    }
}
