<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\Products;
use App\Models\RebateReports;
use App\Models\RebateReportsHousesProducts;
use App\Models\User;

class RebateReportOfOrganization
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        try {
            $whoAmI = AuthHelpers::whoAmI();
            $Activeuser = AuthHelpers::extractUserFromWhoAmI($whoAmI);
        } catch (\Exception $ex){
            throw $ex;
        }

        if ( isset( $args['orgId'] )  ) {
            $organization = \App\Models\Organizations::find($args['orgId']);
            if(!$organization)throw new \Exception('Must provide a valid organization id');
        } else {
            throw new \Exception('Must provide a valid organization id');
        }

        $orgId = AuthHelpers::seeIfUserAsAccessToOrganization($Activeuser, $organization->id);
        if($orgId===false) throw new \Exception("Not Allow to access the requested organization");

        if ( $organization ) {
            $rebateReport = RebateReports::where('organization_id', $organization->id )->first();

            if( !$rebateReport ) return null;

//            if ( isset( $args['status'] ) ){
//                switch ($args['status']) {
//                    case 'action required':
//                        $houses_relations = $rebateReport->NeedActionHouses()->pluck('rebateReports_houses_products.house_id')->unique()->all();
//                        break;
//                    case 'rebate ready':
//                        $houses_relations = $rebateReport->ReadiedHouses()->pluck('rebateReports_houses_products.house_id')->unique()->all();
//                        break;
//                    case 'completed':
//                        $houses_relations = $rebateReport->CompletedHouses()->pluck('rebateReports_houses_products.house_id')->unique()->all();
//                        break;
//                    default:
//                        $houses_relations = $rebateReport->houses()->pluck('rebateReports_houses_products.house_id')->unique()->all();
//                }
//            }
//            else {
////                throw new \Exception("61");
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
//
//                $product_relations = $all_product_relations->where('house_id',(gettype($house_model)==='object'?$house_model->id:$house_model));
//
//                //{\"id\":477,
//                //\"rebateReport_id\":79
//                //,\"house_id\":88
//                //,\"product_id\":5588,
//                //\"status\":\"action required\",
//                //\"product_quantity\":1,
////                throw new \Exception(json_encode($product_relations));
////
////                $product_info = $product_relations->pluck('product_quantity','product_id');
////                $inner_product_ids = $product_relations->pluck('product_id')->unique()->all();
////                $all_product_ids = $all_product_ids->merge($inner_product_ids);
//
//                $housesReturnArray[(gettype($house_model)==='object'?$house_model->id:$house_model)] = [
//                    "house_id"=>(gettype($house_model)==='object'?$house_model->id:$house_model),  //Int
//                    "products"=> $product_relations
//                ];
//            }
//
////            throw new \Exception(json_encode($housesReturnArray));
//
//            $all_products = Products::whereIn('id',$all_product_ids)->get();
//
////            throw new \Exception("before");
////            throw new \Exception(json_encode($houses_relations));
//
//            $housesReturnArray = [];
//            foreach ($houses_relations as $house_model) { //loop 549
//
//                $product_relations = $all_product_relations->where('house_id',(gettype($house_model)==='object'?$house_model->id:$house_model));
//                $product_qty = $product_relations->pluck('product_quantity','product_id');
//
//                $productsReturnArray = [];
//
//                $product_ids = array_keys($product_qty->toArray());
//
//                //id => model
//
//
//                //loop 54
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
//                    "house_id"=>(gettype($house_model)==='object'?$house_model->id:$house_model),  //Int
//                    "products"=>$productsReturnArray //Array (  Product (Model), qty (Int) )
//                ];
//            }

//            throw new \Exception("here");

            return [
//                "houses" => $housesReturnArray,
                "report" => $rebateReport
            ];
        } else {
            return null;
        }
    }
}
