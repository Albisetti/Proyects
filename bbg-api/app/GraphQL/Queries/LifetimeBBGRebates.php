<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use Exception;
use App\Models\RebateReports;
use App\Models\claimsRebateReports;

class LifetimeBBGRebates
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

		if($user->type !== 'builders') {
			throw new Exception('Unauthorized user ID ' . $user->id . ' asking for lifetime BBG rebate value.');
		}

		$organization = $user->organizations()->first();
		if(!$organization) {
			throw new Exception('User with ID ' . $user->id . ' requesting lifetime rebates as an orphan builder?');
		}

		$total = $organization->previousEarnedToDate || 0;
		$reports = claimsRebateReports::all();

		foreach($reports as $report) {
			$results = $report->rebateReport()->get();

			foreach($results as $result) {
				$report_id = $result->rebateReport_id;
				$related_report = RebateReports::find($report_id);
				$organization_id = $related_report->organization_id;

				if($organization_id != $organization->id) {
					continue;
				} 

				$total += $report->builder_allocation;
			}
		}

		return $total;
    }
}
