<?php

namespace App\GraphQL\Mutations;

use App\Models\RebateReports;
use App\Models\RebateReportsHouses;
use App\Models\RebateReportsHousesProducts;
use Illuminate\Support\Facades\DB;

class RemoveProductFromRebateReportHouse
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        DB::beginTransaction();
            if ( empty($args['reportId']) ) throw new \Exception('No Rebate Report id provided');
            if ( empty($args['input']) ) throw new \Exception('No Input given');

        try {
            foreach ( $args['input'] as $houseProduct ) {
                $rebatesOfRebateReport = RebateReportsHousesProducts::where('rebateReport_id',$args['reportId'])->get();
                $rebates = $rebatesOfRebateReport
                    ->where('house_id',$houseProduct['house_id'])
                    ->whereIn('product_id',$houseProduct['product_ids'])
                    ; //needed to use the eloquent delete, which as our overwrite, otherwise the delete would be the sql delete

                foreach ($rebates as $rebate){
                    $closed = !$rebate->claims->whereIn('status',['submitted','disputed','ready to close','close'])->isEmpty();

                    if(
                        $closed
                    ) {
                        throw new \Exception('Cannot modify product ' . $rebate->product_id . ' on house ' . $rebate->house_id);
                    } else {

                        $rebatesOfRebateReport = $rebatesOfRebateReport->reject(function($value, $key)use($rebate){
                            return $value->id == $rebate->id;
                        });

                        $rebate->delete();

                        if($rebatesOfRebateReport->isEmpty()){
                            $rebateReport = RebateReports::find((int) $args['reportId']);
                            if($rebateReport) {
                                $rebateReport->forceDelete();
                                $deleted =1;
                            } else {
                                $rebateReport;
                                $deleted =0;
                            }
                        }
                    }
                }
            }
            DB::commit();
        } catch (\Exception $ex){
            DB::rollBack();
            throw new \Exception($ex->getMessage());
        }

        return ( isset($deleted) && $deleted ? null : RebateReports::findOrFail($args['reportId']) );
    }
}
