<?php

namespace App\GraphQL\Mutations;

use App\Models\Claims;
use App\Models\Houses;
use App\Models\Organizations;
use App\Models\Products;
use App\Models\RebateReports;
use App\Models\RebateReportsHousesProducts;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Execution\Arguments\Argument;
use Nuwave\Lighthouse\Execution\Arguments\ArgumentSet;
use Nuwave\Lighthouse\Execution\Arguments\NestedBelongsTo;
use Nuwave\Lighthouse\Execution\Arguments\ResolveNested;

class updateRebateReportAndMassAssign
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        DB::beginTransaction();

        try {

            $rebateReport = RebateReports::where('id',$args['id'])->first();
            if ( !$rebateReport ) throw new \Exception('No Rebate Report found with provided id');
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

                    //TODO: Since currently Organization only accepts connection type of connect, and only a singular value move code outside of loop
                    $organization = Organizations::where('id',$connectionsData)->first();
                    if ($organization) $rebateReport->organization()->associate($organization);
                }
            }


            $rebateReport->save();

            $refusedChanges = collect([]);
            $rebateWasChange=false;

            //SyncWithoutDetaching
            if ( isset($argCollection['houses']) ) {    ///user provided list house ids to update
                if ( isset($argCollection['products']) ) {  ///user provided list product ids, and each quantity of those product used to update on the above houses

                    $houseIds = collect($argCollection['houses']);

                    $productsInput = collect($argCollection['products']);
                    $productsIds = $productsInput->pluck('id'); ///take the user input products/quantity and just make product id list

                    $NonChangableCombinations = RebateReportsHousesProducts::
                    whereIn('house_id',$houseIds)
                        ->where('rebateReport_id',$rebateReport->id)
                        ->whereIn('product_id',$productsIds)
                        ->whereHas('claims',function ($query){
                            $query->whereIn('status',['submitted','disputed','ready to close','close']);
                        })
                        ->get();  ///Using the provided rebateReport id, house ids, product ids, figure which records we cannot update, return record of the 3 way-pivot

                    $refusedChanges = $NonChangableCombinations->pluck('house_id','product_id');
                    $refusedChanges = $refusedChanges->map(function ($house_id, $product_id){
                        $report['house'] = $house_id;
                        $report['product'] = $product_id;
                        unset($report[$product_id]);
                        return $report;
                    });

                        $newValues = '';
                        $productsInput->each(function($item, $key)use(&$newValues){
                            $newValues .= ' WHEN ';
                            $newValues .= $item['id'];
                            $newValues .= ' THEN ';
                            $newValues .= ( isset($item['quantity']) ? $item['quantity'] : 1 );
                        });

                        $query = "UPDATE `rebateReports_houses_products`";
                        $query .= " SET product_quantity = CASE product_id";
                        $query .= $newValues;
                        $query .= " END";
                        $query .= " WHERE house_id IN (" . implode(',',$houseIds->toArray()) . ")";
                        $query .= " AND product_id IN (" . implode(',',$productsIds->toArray()) . ")";
                        $query .= " AND rebateReport_id = " . $rebateReport->id;
                        if( $NonChangableCombinations->isNotEmpty() ) $query .= " AND id NOT IN (" . implode(',',$NonChangableCombinations->pluck('id')->toArray()) . ")";

//                    throw new \Exception(json_encode($query));

                    $innerResults = DB::statement(DB::raw($query));

//                    throw new \Exception(json_encode($innerResults));

                    $combination = //combination
                        collect($argCollection['houses'])->map(function ($houseId)use($productsInput,$rebateReport){
                            $record = $productsInput->map(function($report)use($houseId,$rebateReport) {
                                $report['product_id'] = $report['id'];
                                unset($report['id']);
                                $report['product_quantity'] = (isset($report['quantity'])?$report['quantity']:1);
                                if(isset($report['quantity'])) unset($report['quantity']);
                                $report['rebateReport_id'] = $rebateReport->id;
                                $report['house_id'] = $houseId;
                                return $report;
                            });
                            return $record;
                        })->flatten(1);
                    ;

                    //Add Any missing Record, Ignore errors that unique-rhp (unique combination of rebateReport_id, house_id, product_id)
                    //If the unique key combo of (rebateReport_id, house_id, product_id) is not set in sql, then the following line will create duplicates
                    $newRecords = RebateReportsHousesProducts::insertOrIgnore($combination->toArray());

                    $claims = Claims::whereHas('rebateReports',function($query)use($rebateReport,$houseIds,$productsIds,$NonChangableCombinations){
                        $query
                            ->whereNotIn('rebateReports_houses_products.id',$NonChangableCombinations->pluck('id'))
                            ->where('rebateReports_houses_products.rebateReport_id',$rebateReport->id)
                            ->whereIn('rebateReports_houses_products.house_id',$houseIds)
                            ->whereIn('rebateReports_houses_products.product_id',$productsIds);
                    })
                        ->whereIn('claims.status',['ready'])->update(['claims.status'=>'open']);
                    ;
                }
            }
            $rebateReport->refresh();

            DB::commit();
        } catch (\Exception $e){
            DB::rollBack();
            throw $e;
        }

        return [
            'report'=>$rebateReport,
            'refusedChanges'=>$refusedChanges
        ];
    }
}
