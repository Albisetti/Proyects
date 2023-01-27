<?php

namespace App\GraphQL\Mutations;

use App\Models\Organizations;
use App\Models\RebateReports;
use App\Models\RebateReportsHouses;
use App\Models\RebateReportsHousesProducts;
use App\Models\RebateReportsProducts;
use App\Models\SubContractors;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\Arguments\Argument;
use Nuwave\Lighthouse\Execution\Arguments\ArgumentSet;
use Nuwave\Lighthouse\Execution\Arguments\NestedBelongsTo;
use Nuwave\Lighthouse\Execution\Arguments\ResolveNested;

class createRebateReportAndMassAssign
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        DB::beginTransaction();

        try {
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
//                    TODO: does not check if org. already has a rebate report

                foreach ($argCollection['organization'] as $connectionType => $connectionsData ) {
                    //only connect ID is supported at the moment
                    if($connectionsData) $rebateReport->organization_id = $connectionsData;
                }
            } else {
                throw new \Exception('Missing a Organization ID');
            }

            $rebateReport->save();

            if ( isset($argCollection['houses']) ) {

                $combination = [];

                foreach ($argCollection['houses'] as $houseId ) {

//                    TODO: does not check if org has access to houses or products

                    if ( !isset( $houseId ) ) {
                        throw new \Exception('Missing a House ID in products node.');
                    }

                    if ( isset($argCollection['products']) ) {
                        foreach ($argCollection['products'] as $productNode => $productData ) {
                            if ( !isset( $productData['id'] ) ) {
                                throw new \Exception('Missing a Product ID in products node.');
                            }

                            $insertInput = [
                                'rebateReport_id'=>$rebateReport->id,
                                'house_id'=>$houseId,
                                'product_id'=>$productData['id'],
                                'product_quantity'=> (isset( $productData['quantity']) ? $productData['quantity'] : 1)
                            ];

                            $combination[]=$insertInput;
                        }
                    }
                }

                //The SQL unique_rhp key should prevent combos of rebateReport_id, house_id, product_id from being created more the once.
                if ( !empty($combination) ) $newRecords = RebateReportsHousesProducts::insertOrIgnore($combination);
            }
            DB::commit();

        } catch (\Exception $ex) {
            DB::rollBack();
//            throw $ex;
        }

        return $rebateReport;
    }
}
