<?php

namespace App\GraphQL\Queries;

class DashboardReporting
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
		$response = [
			"currentProjectedRebate" => 0,
			"filteredRebate" => 0
		];
		
		return $response;
    }
}
