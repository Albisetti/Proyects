<?php

namespace App\GraphQL\Mutations;

use App\Models\Houses;
use App\Models\State;
use App\Models\SubDivision;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use League\Csv\CharsetConverter;

class CreateHouseFromCSV
{

    private $NonAllowFields = [ 'id', 'property_type', 'state_id', 'subdivision_id' ];

    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $file = $args['file'];

        if ( isset($args['propertyType']) ) {
            $propertyType = $args['propertyType'];
        } else {
            throw new \Exception('No property type set on the mutation');
        }

        if ( isset($args['subdivisionId']) ) {
            $subdivisionId = $args['subdivisionId'];
//            $subdivision = SubDivision::find($subdivisionId);
        } else {
            throw new \Exception('No subdivision set on the mutation');
        }

        if ( isset($args['organizationId']) ) {
            $organizationId = $args['organizationId'];
        } else {
            throw new \Exception('No organization set on the mutation');
        }

        if($file) {

            //TODO: Check file type
            //$file->get() returns content of file in string format

            $csv = Reader::createFromString($file->get());
            $csv->setHeaderOffset(0);

            /* From league/csv docs: detect UTF-8/UTF-16 */
            $input_bom = $csv->getInputBOM();
            if ($input_bom === Reader::BOM_UTF16_LE
                || $input_bom === Reader::BOM_UTF16_BE) {
                CharsetConverter::addTo($csv, 'utf-16', 'utf-8');
            }

            $headers = $csv->getHeader();
            $houses = [];

            $customSubdivisions = [];

            /* getRecords() is an iterable */
            foreach ($csv->getRecords() as $record) {
                $record = collect($record);

                try {
                    $house = [];
                    $fillableFields = (new Houses())->getFillable();

                    if (
                        (!isset($record['address']) || empty($record['address']))
                        && (!isset($record['address2']) || empty($record['address2']))
                        && (!isset($record['zip_postal']) || empty($record['zip_postal']))
                        && (!isset($record['lot_number']) || empty($record['lot_number']))
                    ) throw new \Exception("Trying to add an empty house.");

                    if(isset($organizationId)&&!empty($organizationId)){
                        $house['organization_id']=$organizationId;
                    }

                    if (isset($record['state'])) {
                        if ( isset(State::$stateID[strtoupper(trim($record['state']))]) ) {
                            //TODO: pretty sure find get's from DB, is there anything lighter
                            //TODO: Move outside of the loop
                            if ( !State::find(State::$stateID[strtoupper(trim($record['state']))]) ) throw new \Exception("ISO Code " . $record['state'] . " as invalid ID associated with it");
                            $house['state_id'] = State::$stateID[strtoupper(trim($record['state']))];
                        } else {
                            throw new \Exception("Invalid ISO state Code as been provided");
                        }
                    }

                    if (isset($record['subdivision']) && !empty($record['subdivision'])){
                        $customSubdivisions[] = [
                            'name'=>$record['subdivision'],
                            'organization_id'=>(Int)$organizationId
                        ];
                        $house['subdivision_id'] = $record['subdivision'];
                    } else {
                        $house['subdivision_id'] = $subdivisionId;
                    }

                    foreach ($fillableFields as $field) {
                        if($record->has($field) && !in_array($field,$this->NonAllowFields) ){

                            if( $field == 'confirmed_occupancy' ) {
                                $house[$field] = Carbon::createFromFormat('n/j/y',trim($record[$field]));
                            }
                            else {
                                $house[$field] = $record[$field];
                            }
                        }
                    }

                    $house['property_type'] = $propertyType;

                    $houses[] = $house;

                } catch (\Exception $ex) {
                    throw new \Exception($ex->getMessage());
                }
            }

            DB::beginTransaction();

            try {
                if (!empty($customSubdivisions)){

                    $existingSubdivisions = SubDivision::where('organization_id',$organizationId)
                        ->whereIn('name',collect($customSubdivisions)->pluck('name'))
                        ->get()
                    ;

                    $newSubdivision = collect($customSubdivisions)->whereNotIn('name', $existingSubdivisions->pluck('name'));

                    $subdivisionInsert = SubDivision::insert($newSubdivision->unique('name')->toArray());

                    $GottenSubdivisions = SubDivision::where('organization_id',$organizationId)
                        ->whereIn('name',collect($customSubdivisions)->pluck('name'))
                        ->get()
                    ;

                    foreach ($houses as $index=>$house) {
                        if ( $customSubdivision = $GottenSubdivisions->where('name',$house['subdivision_id'])->first() ){
                            $houses[$index]['subdivision_id'] = $customSubdivision->id;
                        }
                    }
                }

                $results = Houses::insert($houses); //Insert doesn't return model ids

                $newHouse = Houses::
                    whereIn('address',collect($houses)->pluck('address'))
                    ->whereIn('address2',collect($houses)->pluck('address2'))
                    ->whereIn('zip_postal',collect($houses)->pluck('zip_postal'))
                    ->whereIn('lot_number',collect($houses)->pluck('lot_number'))
                    ->whereIn('project_number',collect($houses)->pluck('project_number'));

                if( isset($GottenSubdivisions) && !empty($GottenSubdivisions) ){
                    $newHouse = $newHouse->whereIn('subdivision_id',array_merge($GottenSubdivisions->pluck('id')->toArray(),[$subdivisionId]));
                } else {
                    $newHouse = $newHouse->whereIn('subdivision_id',[$subdivisionId]);
                }

                $newHouse = $newHouse->get();

                DB::commit();
            } catch (\Exception $ex){
                DB::rollBack();
                throw $ex;
            }

            return $newHouse;
        }
    }

}
