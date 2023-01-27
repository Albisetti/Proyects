<?php

namespace App\GraphQL\Mutations;

use App\Models\Houses;
use Illuminate\Support\Facades\DB;

class UpdateHouses
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        $houses = collect([]);

        DB::beginTransaction();

        try {

            if(isset($args['houses']) && !empty($args['houses']) ) {
                foreach ( $args['houses'] as $houseArgs ) {
                    $house = Houses::findOrFail($houseArgs['id']);
                    $fillableFields = $house->getFillable();
                    $argCollection = collect($houseArgs['input']);

                    foreach ($fillableFields as $field) {
                        //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                        if($argCollection->has($field)){
                            $house->$field = $houseArgs['input'][$field];
                        }
                    }

                    $house->save();
                    $house->refresh();
                    $houses->push($house);
                }

                DB::commit();
            }
        } catch (\Exception $ex){
            DB::rollBack();
            throw $ex;
        }

        return $houses;
    }
}
