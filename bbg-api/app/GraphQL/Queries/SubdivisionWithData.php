<?php

namespace App\GraphQL\Queries;

use App\Models\SubDivision;

class SubdivisionWithData
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        if ( isset( $args['id'] ) ) {
            $subdivisionId = $args['id'];
        } else {
            throw new \Exception("Must provide a subdivision id");
        }

        $subdivision = SubDivision::find($subdivisionId);

        $residentialCount = $subdivision->houses()->where('property_type','residential')->count();
        $multiUnitCount = $subdivision->houses()->where('property_type','multi-unit')->count();
        $commercialCount = $subdivision->houses()->where('property_type','commercial')->count();

        $rebateReportInProgressCount = 0;
        $rebateReportCompletedCount = 0;
        $houses = $subdivision->houses()->get();
        foreach ( $houses as $house ) {
            $rebateReportInProgressCount += $house->rebateReports()->wherePivotIn('status',['action required','rebate ready'])->count();
            $rebateReportCompletedCount += $house->rebateReports()->wherePivot('status','completed')->count();
        }

        //TODO: data part returns correctly. subdivision returns null
        return [
            "data" => [
                "residential_number" => $residentialCount,
                "multiUnit_number" => $multiUnitCount,
                "commercial_number" => $commercialCount,
                "rebate_inProgress_number" => $rebateReportInProgressCount,
                "rebate_rebated_number" => $rebateReportCompletedCount
            ],
            "subdivision" => $subdivision
        ];
    }
}
