<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\Products;
use App\Models\RebateReports;
use App\Models\RebateReportsHousesProducts;
use App\Models\RebateReportsProducts;
use App\Models\User;

class RebateReportOfCurrentUserOrganization
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

        $orgId = ($user->organizations()->exists() ? $user->organizations()->first()->id : -1);

        if ( isset($orgId) ) {
            $rebateReport = RebateReports::where('organization_id', $orgId )->first();

            if( !$rebateReport ) {
                return null;
            }

//            if ( isset( $args['status'] ) ){
//                switch ($args['status']) {
//                    case 'action required':
//                        $houses_relations = $rebateReport->NeedActionHouses()->pluck('rebateReports_houses_products.house_id')->unique()->all();
//                    break;
//                    case 'rebate ready':
//                        $houses_relations = $rebateReport->ReadiedHouses()->pluck('rebateReports_houses_products.house_id')->unique()->all();
//                    break;
//                    case 'completed':
//                        $houses_relations = $rebateReport->CompletedHouses()->pluck('rebateReports_houses_products.house_id')->unique()->all();
//                    break;
//                    default:
//                        $houses_relations = $rebateReport->houses()->pluck('rebateReports_houses_products.house_id')->unique()->all();
//                    }
//            }
//            else {
//               //throw new \Exception("61");
//                $houses_relations = $rebateReport->houses()->get();
//            }
//
//            $all_product_relations = RebateReportsHousesProducts::whereIn('house_id',
//                (gettype($houses_relations)==='array' ? $houses_relations : $houses_relations->pluck('id')->all())
//                )->get();
//
//            //Make a singular global Product call
//            $all_product_ids = collect([]);
//            foreach ($houses_relations as $house_model) {
//                $product_relations = $all_product_relations->where('house_id',(gettype($house_model)==='object'?$house_model->id:$house_model));
//                $product_qty = $product_relations->pluck('product_id')->unique()->all();
//                $all_product_ids = $all_product_ids->merge($product_qty);
//            }
//
//            $all_products = Products::whereIn('id',$all_product_ids)->get();
//
//            $housesReturnArray = [];
//            foreach ($houses_relations as $house_model) {
//
//                $product_relations = $all_product_relations->where('house_id',(gettype($house_model)==='object'?$house_model->id:$house_model));
//                $product_qty = $product_relations->pluck('product_quantity','product_id');
//
//                $productsReturnArray = [];
//
//                $product_ids = array_keys($product_qty->toArray());
////                $products = Products::whereIn('id',$product_ids)->get();
//
//                foreach ($product_qty as $product_id=>$qty) {
////                    $product = Products::find($product_id);
//
//                    $productsReturnArray[] = [
//                        "product" => $all_products->where('id',$product_id)->first(),
//                        "qty" => $qty
//                    ];
//                }
//
//                $housesReturnArray[] = [
//                    "house_id"=>(gettype($house_model)==='object'?$house_model->id:$house_model),
//                    "products"=>$productsReturnArray
//                ];
//            }

            return [
//                "houses" => $housesReturnArray,
                "report" => $rebateReport
            ];
        } else {
            return null;
        }
    }
}
