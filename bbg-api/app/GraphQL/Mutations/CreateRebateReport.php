<?php

namespace App\GraphQL\Mutations;

use App\Models\Organizations;
use App\Models\RebateReports;
use App\Models\RebateReportsHouses;
use App\Models\RebateReportsProducts;
use App\Models\SubContractors;
use Nuwave\Lighthouse\Execution\Arguments\Argument;
use Nuwave\Lighthouse\Execution\Arguments\ArgumentSet;
use Nuwave\Lighthouse\Execution\Arguments\NestedBelongsTo;
use Nuwave\Lighthouse\Execution\Arguments\ResolveNested;

class CreateRebateReport
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        $rebateReport = new RebateReports();
        $fillableFields = $rebateReport->getFillable();
        $argCollection = collect($args);

        foreach ($fillableFields as $field) {
            //if (in_array(trim($field), $args)) { => in_array do not work with associative array
            if($argCollection->has($field)){
                $rebateReport->$field = $args[$field];
            }
        }

        if ( isset($argCollection['organization']) ) {

            foreach ($argCollection['organization'] as $connectionType => $connectionsData ) {

                $organization = Organizations::find($connectionsData);
                if($organization) $rebateReport->organization()->associate($organization);

                //TODO: figure out that Argument, and replace above with it
//                foreach ($connectionsData as $property => $value) {
//                    $argument = new Argument();
////                    $argument->directives = $this->directiveFactory->associated($definition);
//                    $argument->type = "string";
//                    $argument->value = $value;
//
//                    $argCollection['organization'][$connectionType][$property] = $argument;
//
//                }
            }
//
//            $argumentSet = new ArgumentSet();
//            $argumentSet->arguments = $argCollection['organization'];
//
//            /** @var \Illuminate\Database\Eloquent\Relations\BelongsTo $belongsTo */
//            $belongsTo = $rebateReport->organization();
//            $belongsToResolver = new ResolveNested(new NestedBelongsTo($belongsTo));
//            $belongsToResolver($rebateReport, $argumentSet);
        }

        $rebateReport->save();

        if ( isset($argCollection['houses']) ) {

            foreach ($argCollection['houses'] as $connectionType => $connectionsData ) {

                foreach ( $connectionsData as $houseArg ) {
                    $rebateReportsHousesPivot = new RebateReportsHouses();
                    $fillableFields = $rebateReportsHousesPivot->getFillable();
                    $housePivotArg = collect($houseArg);

                    $rebateReportsHousesPivot->rebateReport_id = $rebateReport->id;

                    foreach ($fillableFields as $field) {
                        //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                        if ($field == 'house_id') {
                            $rebateReportsHousesPivot->$field = $housePivotArg['id']; //TODO: move to relation method instead?
                        } else if ($housePivotArg->has($field)) {
                            $rebateReportsHousesPivot->$field = $housePivotArg[$field];
                        }
                    }

                    $rebateReportsHousesPivot->save();

                    if ( isset($housePivotArg['products']) ) {

                        foreach ($housePivotArg['products'] as $productConnectionType => $productConnectionsData ) {

                            foreach ( $productConnectionsData as $productArgs ) {
                                $rebateReportsHousesProductPivot = new RebateReportsProducts();
                                $fillableFields = $rebateReportsHousesProductPivot->getFillable();
                                $productPivotArg = collect($productArgs);

                                $rebateReportsHousesProductPivot->rebateReport_house_id = $rebateReportsHousesPivot->id;

                                foreach ($fillableFields as $field) {
                                    //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                                    if ($field == 'product_id') {
                                        $rebateReportsHousesProductPivot->$field = $productArgs['id']; //TODO: move to relation method instead?
                                    } else if ($productPivotArg->has($field)) {
                                        $rebateReportsHousesProductPivot->$field = $productPivotArg[$field];
                                    }
                                }

                                //TODO: simple Belongs too
                                if ( isset($productPivotArg['distributor']) ) {
                                    $rebateReportsHousesProductPivot->distributor_id = $productPivotArg['distributor'];
                                }

                                $rebateReportsHousesProductPivot->save();
                            }
                        }
                    }
                }
            }
        }


        return $rebateReport;
    }
}
