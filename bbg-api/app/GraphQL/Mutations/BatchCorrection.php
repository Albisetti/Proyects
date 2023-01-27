<?php

namespace App\GraphQL\Mutations;

use App\Models\RebateReportsHousesProducts;
use Illuminate\Support\Facades\DB;

class BatchCorrection
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        if ( !isset($args['rebates']) || empty($args['rebates']) ) return [];
        $rebates = RebateReportsHousesProducts::whereIn('id',$args['rebates'])->get();

        if( !isset($args['input']) || empty($args['input'])) throw new \Exception("No Action Provided");
        $input = $args['input'];

        if( !isset($input['action'])) throw new \Exception("No Action Provided");

        try {
            switch ($input['action']) {
                default:
                    throw new \Exception('No Action Provided');
                    break;
                case 'REMOVE':
                    $results = BatchCorrection::removeProduct($rebates);
                    break;
                case 'CHANGE_QTY':
                    if( !isset($input['qty'])) throw new \Exception("Unable to run action");
                    $results = BatchCorrection::changeProductQty($rebates, $input['qty']);
                    break;
                case 'REPLACE':
                    if( !isset($input['newProduct'])) throw new \Exception("Unable to run action");
                    $results = BatchCorrection::replaceProduct($rebates, $input['newProduct'], ( isset($input['qty']) ? $input['qty'] : null ));
                    break;
            }
        } catch (\Exception $ex){
            throw $ex;
        }

        return $results;
    }

    private static function removeProduct($rebates){

        DB::beginTransaction();
        try {

            foreach ( $rebates as $rebate ){
                if(
                $rebate->claims()->whereIn('status',['submitted','disputed','ready to close','close'])->exists()
                ) throw new \Exception('House ' . $rebate->house_id . ' and product ' . $rebate->product_id . ' cannot be modified.');

                $rebate->claims()->detach();
                $rebate->dispute()->delete();
                $rebate->delete();
            }

            DB::commit();
        }catch (\Exception $ex){
            DB::rollBack();
            throw new \Exception($ex);
        }

        return $rebates;
    }

    private static function changeProductQty($rebates, $newQty){

        DB::beginTransaction();
        try {

            foreach ( $rebates as $rebate ){
                if(
                $rebate->claims()->whereIn('status',['submitted','disputed','ready to close','close'])->exists()
                ) throw new \Exception('House ' . $rebate->house_id . ' and product ' . $rebate->product_id . ' cannot be modified.');

                $rebate->product_quantity = $newQty;
                $rebate->save();
            }

            DB::commit();
        }catch (\Exception $ex){
            DB::rollBack();
            throw new \Exception($ex);
        }

        return $rebates;
    }

    private static function replaceProduct($rebates, $newProductId, $newQty=null){

        DB::beginTransaction();
        try {

            foreach ( $rebates as $rebate ){
                if(
                    $rebate->claims()->whereIn('status',['submitted','disputed','ready to close','close'])->exists()
                ) {
                    throw new \Exception('House ' . $rebate->house_id . ' and product ' . $rebate->product_id . ' cannot be modified.');
                } else if($rebate->claims()->whereIn('status',['ready'])->exists()){
                    $rebate->claims()->whereIn('status',['ready'])->update(['status'=>'open']);
                }

                $rebate->product_id = $newProductId;
                if(isset($newQty))$rebate->product_quantity = $newQty;
                $rebate->status = ( $rebate->readyForClaim() ? "rebate ready" : "action required" );
                $rebate->save();
            }

            DB::commit();
        }catch (\Exception $ex){
            DB::rollBack();
            throw new \Exception($ex);
        }

        return $rebates;
    }
}
