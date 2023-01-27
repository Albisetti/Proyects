<?php

namespace App\GraphQL\Mutations;

use App\Models\Claims;
use App\Models\OrganizationCustomProduct;
use App\Models\ProductsPrograms;
use App\Models\RebateReportsHousesProducts;
use Illuminate\Support\Facades\DB;

class SubmitAllReadyBuilderToClaim
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        DB::beginTransaction();

        try {
            if(!isset($args['id'])) throw new \Exception('Missing Id');
            $claim = Claims::findOrFail($args['id']);
            $program_id = $claim->program_id;
            $product_type = $claim->claim_template_product_type;
            $product_id = $claim->claim_template_product_id;

            $rebateIds = collect([]);

            if(isset($claim->claim_end_date)){
                $rebates = RebateReportsHousesProducts::
                where('status','!=','completed')
                    ->whereDate('created_at', '<=',$claim->claim_end_date)
                    ->with(['rebateReports','products'])
                    ->get();

                foreach ( $rebates as $rebate ){
                    if (isset($product_type) && isset($product_id)){
                        if( $product_type === "App\\Models\\OrganizationCustomProduct" ) {
                            if(
                                OrganizationCustomProduct::where('program_id',$program_id)
                                ->where('product_id',$rebate->products->id)
                                ->where('id',$product_id)
                                ->exists()
                            )
                            {
                                $rebateIds->push($rebate->id);
                                continue;
                            }
                        } elseif ( $product_type === "App\\Models\\ProductsPrograms" ) {
                            if(
                            ProductsPrograms::where('program_id',$program_id)
                                ->where('product_id',$rebate->products->id)
                                ->where('id',$product_id)
                                ->exists()
                            )
                            {
                                $rebateIds->push($rebate->id);
                                continue;
                            }
                        }
                    } else {
                        if( isset($rebate->products) && $rebate->products->programs->contains('id',$program_id)) {
                            $rebateIds->push($rebate->id);
                            continue;
                        }
                    }
                }
                $claim->rebateReports()->syncWithoutDetaching($rebateIds);
                $claim->save();
                $claim->refresh();
            }

            DB::commit();
        } catch (\Exception $ex){
            DB::rollBack();
            throw $ex;
        }

        return $claim;
    }
}
