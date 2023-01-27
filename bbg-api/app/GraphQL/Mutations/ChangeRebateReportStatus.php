<?php

namespace App\GraphQL\Mutations;

use App\Models\RebateReports;
use App\Models\RebateReportsHouses;
use App\Models\RebateReportsHousesProducts;

class ChangeRebateReportStatus
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $errors = [];

        $rebateReportHouse = RebateReportsHousesProducts::where("rebateReport_id",$args['rebateReport_id'])->where("house_id",$args['house_id'])->firstOrFail();
        if( $rebateReportHouse->status === 'completed' ) {
            $errors[] = "Cannot change completed rebate ( ".$rebateReportHouse->id." )";
        } else {
            $rebateReportHouse->status = $args['status'];
            $rebateReportHouse->save();
        }

        return [
          'rebateReport'=>RebateReports::findOrFail($args['rebateReport_id']),
          'errors'=>$errors
        ];
    }
}
