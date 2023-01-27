<?php

namespace App\GraphQL\Queries;

use App\Models\RebateReportsHousesProducts;

class GetPropertyForBatchCorrection
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver

        $org_id=$args['orgId'];

        $rebates = RebateReportsHousesProducts::
            with(['houses'])
            ->whereHas('rebateReports',function ($query)use($org_id){
                $query->where('organization_id', $org_id);
            })
            ->where('product_id', $args['productId']);

        if ( isset($args['startDate']) && isset($args['endDate']) ){
            $rebates->whereHas('claims',function ($query)use($args){
                $query
                    ->whereNotIn('claims.status',['close','ready to close'])
                    ->whereDate('claim_start_date',$args['startDate'])
                    ->whereDate('claim_end_date',$args['endDate'])
                ;
            });
        } else {
            $rebates->where(function ($query){
                $query->whereDoesntHave('claims');
            });
        }

        $rebates = $rebates->get();

//        throw new \Exception(json_encode($rebates));

        $results = collect([]);
        foreach ( $rebates as $rebate ){
            $subdivision = $rebate->houses->subdivision()->first();

            $houseRebateData = [
                'house' => $rebate->houses,
                'rebate' => $rebate
            ];

//            throw new \Exception(json_encode($houseRebateData));

            if ( isset($results[$subdivision->id]) ){
                $results[$subdivision->id]['houses'] = $results[$subdivision->id]['houses']->merge(collect([$houseRebateData]));
            } else {
                $results[$subdivision->id] = [
                    'id'=>$subdivision->id,
                    'name'=>$subdivision->name,
                    'houses'=>collect([$houseRebateData])
                ];
            }
        }

        return $results;
    }
}
