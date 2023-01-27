<?php

namespace App\GraphQL\Mutations;

use App\Models\Houses;
use App\Models\SubDivision;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PrepareRebate
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        DB::beginTransaction();
        try {
            if( isset($args['updateReport']) ) {
                $rebateReport = new UpdateRebateReport;
                //We merge the input and id because @spread doesn't do the same in inner type then the parent one
                $rebateReportResults = $rebateReport(null, $args['updateReport']);
            }

            if( isset($args['updateHouses']) && !empty($args['updateHouses']) ) {

                $fillableFields = (new Houses())->getFillable();
                $excludeUpdateFields = ['created_at','created_by','deleted_at','deleted_by'];
                $updatedFields = array_diff($fillableFields,$excludeUpdateFields);

                //TODO: currently this mutation can update any houses, even non-related ones
                $updateHouseInput = collect($args['updateHouses']);

                $houseQuery = [];
                $caseStatement = [];
                //query
                $houses = Houses::whereIn('id', $updateHouseInput->pluck('id')->toArray())->get();

                foreach ( $args['updateHouses'] as $house ) {

                    if(!isset($house['id'])) throw new \Exception('No houses found with provided id');

                    $houseModel = $houses->firstWhere('id', $house['id']); //extract from collection, **not** query

                    if ( !$houseModel ) throw new \Exception('No houses found with provided id');

                    $argCollection = collect($house['input']);

                    $houseInput = '';
//                    $fieldsUpdated = [];
                    $index = 0;
                    foreach ($updatedFields as $field) {
                        if($argCollection->has($field)){
                            if($index>=1) $houseInput .= ',';
                            if( (strtolower(gettype($house['input'][$field])) == "string") || $field == 'confirmed_occupancy' ) $houseInput .= "'";
                            $houseInput .= $house['input'][$field];
                            if( (strtolower(gettype($house['input'][$field])) == "string") || $field == 'confirmed_occupancy' ) $houseInput .= "'";
//                            $fieldsUpdated[]=$field;
                            $index++;
                        }
                        else if ($field == 'updated_at' ) {
                            if($index>=1) $houseInput .= ',';
                            $houseInput .= "'" . (Carbon::now())->format('Y-m-d H:i:s') . "'";
//                            $fieldsUpdated[]=$field;
                            $index++;
                        }
                        else {
                            if($index>=1) $houseInput .= ',';
                            if( strtolower(gettype($houseModel[$field])) == "string" ) $houseInput .= "'";
                            $houseInput .= ( isset($houseModel[$field]) ? $houseModel[$field] : 'null' );
                            if( strtolower(gettype($houseModel[$field])) == "string" ) $houseInput .= "'";
//                            $fieldsUpdated[]=$field;
                            $index++;
                        }
                    }

                    $houseQuery[] = '(' . $houseModel->id . ',' . $houseInput . ')';
                }

                $onUpdate = "";
                $index=0;
                foreach ($updatedFields as $field){
                    if($index>=1) $onUpdate .=',';
                    if($field!=='id'){
                        $onUpdate .= $field.'= VALUES('.$field.')';
                    }
                    $index++;
                }

//            throw new \Exception("INSERT into `houses` ( id," . implode(', ', $updatedFields) . " ) VALUES ".implode(',',$houseQuery)." ON DUPLICATE KEY UPDATE " . $onUpdate);
                $results = DB::insert("INSERT into `houses` ( id," . implode(', ', $updatedFields) . " ) VALUES ".implode(',',$houseQuery)." ON DUPLICATE KEY UPDATE " . $onUpdate);

            }

            DB::commit();
        } catch(\Exception $e) {
            DB::rollBack();/* Anything failed - roll back the database */
            throw new \Exception($e->getMessage());
        }
        /* If I have reached this point, all operations on the DB are guaranteed to have succeeded */

        if(isset($rebateReportResults)){
            return [
                'rebateReport'=>$rebateReportResults['rebateReport'],
                'refusedChanges'=>$rebateReportResults['refusedChanges']
            ];
        } else {
            return [
                'rebateReport'=>null,
                'refusedChanges'=>null
            ];
        }
    }
}
