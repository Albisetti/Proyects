<?php

namespace App\GraphQL\Mutations;

use App\Models\Houses;
use App\Models\Organizations;
use App\Models\Products;
use App\Models\RebateReports;
use App\Models\RebateReportsHouses;
use App\Models\RebateReportsHousesProducts;
use App\Models\RebateReportsProducts;
use App\Models\SubContractors;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Psy\Util\Json;

class UpdateRebateReport
{
    /**
     * @param null $_
     * @param array<string, mixed> $args
     */
    public function __invoke($_, array $args)
    {
        //TODO: need to transaction this?

        $rebateReport = RebateReports::where('id',$args['id'])->first();


        if (!$rebateReport) throw new \Exception('No Rebate Report found with provided id');

        $fillableFields = $rebateReport->getFillable();
        $argCollection = collect($args);


        foreach ($fillableFields as $field) {
            //if (in_array(trim($field), $args)) { => in_array do not work with associative array
            if ($argCollection->has($field)) {
                $rebateReport->$field = $args[$field];
            }
        }

        //        TODO: don't forget the disconnects
        if (isset($argCollection['organization'])) {

            foreach ($argCollection['organization'] as $connectionType => $connectionsData) {

                $rebateReport->organization_id = $connectionsData;

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

        //TODO: DOES NOT DETACH/REMOVE PREVIOUS EXISTING INSTANCE THAT AS NOT BEEN PASSED WITH THE CALL
        if (isset($argCollection['houses'])) {

            $fillableFields = (new RebateReportsHousesProducts())->getFillable();
            $excludeUpdateFields = ['created_at','created_by','deleted_at','deleted_by','product_quantity'];
            $updatedFields = array_diff($fillableFields,$excludeUpdateFields);

            $rebateIdCombo = [];
            $houseProductInputs = [];
            $refusedPivotChange = [];
            foreach ($argCollection['houses'] as $connectionType => $connectionsData) {

                //TODO: $connectionType not handle
                //TODO: status needs to be set individually on house

                foreach ($connectionsData as $housePivotArguments) {
                    $housePivotArg = collect($housePivotArguments);

                    $houseProductInput = [
                        'rebateReport_id'=>$rebateReport->id,
                        'house_id'=>$housePivotArg['id'],
                        'product_id'=>$housePivotArg['product_id']
                    ];
                    $rebateIdCombo[] = $houseProductInput;

                    foreach ($updatedFields as $field) {
                        if (in_array($field, ['rebateReport_id','house_id','product_id','created_at','created_by','product_quantity'])) {
                            continue; //set on the firstOrNew, un-needed
                        }
                        else if ($housePivotArg->has($field)) {
                            $newValue = $housePivotArg[$field];

                            if ( $field == 'product_date_of_purchase'
                                || $field == 'product_date_of_installation' ) {

                                $newValue = ( isset($newValue) ? "'".$newValue."'" : 'null' );
                            }

                            if(strtolower(gettype($housePivotArg[$field] )) === 'string') $newValue = "'" . $newValue . "'";

                            $houseProductInput[$field] = $newValue;
                        }
                        else if ($field == 'updated_at' ) {
                            $houseProductInput[$field] = "'" . (Carbon::now())->format('Y-m-d H:i:s') . "'";
                        }
                        else {
                            if($field === 'status'){
                                $houseProductInput[$field] = "'action required'";
                            }
                            else {
                                $houseProductInput[$field] = 'null';
                            }
                        }
                    }

                    $houseProductInputs[] = $houseProductInput;
                }
            }

            $rebateIdComboCollection = collect($rebateIdCombo);
            $houseIds = $rebateIdComboCollection->pluck('house_id')->toArray();
            $productIds = $rebateIdComboCollection->pluck('product_id')->toArray();

//            $house = Houses::whereIn('id', $houseIds)->exists(); //Also done in graphql input, over-verified?
//            if (!$house) throw new \Exception("No House for provided id");
//
//            $product = Products::whereIn('id',$productIds)->exists(); //Also done in graphql input, over-verified?
//            if (!$product) throw new \Exception("No product for provided id");

            $rebateHouseProductPivots = RebateReportsHousesProducts::where('rebateReport_id',$rebateReport->id)
                ->whereIn('house_id',$houseIds)
                ->whereIn('product_id',$productIds)
                ->with(['claims'])
                ->get()
            ;

            foreach ( $rebateHouseProductPivots as $rebateHouseProductPivot ) {
                $matchingHouseProductInputKey = collect($houseProductInputs)->search(function ($item, $key) use ($rebateHouseProductPivot) {
                    if (
                        $item['house_id'] == $rebateHouseProductPivot->house_id
                        && $item['product_id'] == $rebateHouseProductPivot->product_id
                    ) {
                        return true;
                    }
                });

                if ($matchingHouseProductInputKey !== false) { //If a matching pivot record is found
                    if (
                        false !== ($rebateHouseProductPivot->claims->search(function ($item, $key) {
                            if (in_array($item['status'], ['submitted', 'disputed', 'ready to close', 'close'])) return true;
                        }))
                    ) {
                        //If that record is immutable, remove it from the insert input
                        unset($houseProductInputs[$matchingHouseProductInputKey]);
                        $refusedPivotChange[]=[
                            'house_id'=>$rebateHouseProductPivot->house_id,
                            'product_id'=>$rebateHouseProductPivot->product_id,
                            'reason'=>'Cannot be modified due to claim'
                        ];
//                    throw new \Exception('House ' . $housePivotArg['id'] . ' and product ' . $housePivotArg['product_id'] . ' cannot be modified');
                    } else {
                        //If that record is mutable, get any unset field from found record and provide the currently set value

                        foreach ($updatedFields as $field) {
                            if (in_array($field, ['rebateReport_id','house_id','product_id','updated_at','created_at','created_by','product_quantity'])) {
                                continue; //set previously, un-needed
                            }
                            else if ( $houseProductInputs[$matchingHouseProductInputKey][$field] === null ){
                                //if the provide arguments set the field to null
                                $houseProductInputs[$matchingHouseProductInputKey][$field] = 'null';
                            }
                            else if ( $houseProductInputs[$matchingHouseProductInputKey][$field] === 'null' ){
                                //if the provided arguments do not set the field

                                if ( isset($rebateHouseProductPivot->$field) ) {
                                    $newValue = $rebateHouseProductPivot->$field;
                                    if(strtolower(gettype($rebateHouseProductPivot->$field )) === 'string') $newValue = "'" . $newValue . "'";

                                    $houseProductInputs[$matchingHouseProductInputKey][$field] = $newValue;

                                } else {
                                    $houseProductInputs[$matchingHouseProductInputKey][$field] = 'null';
                                }
                            }
                        }
                    }
                }
            }

            //SQL Unique Key Should take care of this
//                    $houseProductCombinationAlreadyExist = RebateReportsHousesProducts::where('house_id',$housePivotArg['id'])->where('product_id',$housePivotArg['product_id'])->where('rebateReport_id', '!=', $rebateReport->id)->exists();
//                    if( $houseProductCombinationAlreadyExist ) throw new \Exception('the house id ' . $housePivotArg['id'] . ' and product id ' . $housePivotArg['product_id'] . ' combination already exist in another rebate report' );


//            throw new \Exception(json_encode($houseProductInputs));

            if ( !empty($houseProductInputs) ){
                $excludeFields = ['id','created_at','created_by','rebateReport_id','house_id','product_id','product_quantity'];
                $onUpdate = "";
                $index=0;
                foreach ($updatedFields as $field){
                    if(!in_array($field,$excludeFields)){
                        if($index>=1) $onUpdate .=',';
                        $onUpdate .= $field.'= VALUES('.$field.')';
                        $index++;
                    }
                }

                $index=0;
                $houseProductInputString = '';
                foreach ($houseProductInputs as $houseProductInput){
                    //Change array to string for sql insert and make sure is null so that sql accepts it

                    if($index>=1) $houseProductInputString .=',';
                    $houseProductInputString  .= '('. implode(',',array_map(function($input){
                        return $input === null ? 'null' : $input;
                        },$houseProductInput)) .')';
                    $index++;
                }
//                throw new \Exception($houseProductInputString);

//                throw new \Exception("INSERT INTO `rebateReports_houses_products` ( ".implode(',',$updatedFields)." ) VALUES " . $houseProductInputString." ON DUPLICATE KEY UPDATE " . $onUpdate);
                DB::insert("INSERT INTO `rebateReports_houses_products` ( ".implode(',',$updatedFields)." ) VALUES " . $houseProductInputString." ON DUPLICATE KEY UPDATE " . $onUpdate);
            }
        }

        return [
            'rebateReport'=>$rebateReport,
            'refusedChanges'=>$refusedPivotChange
        ];
    }
}
