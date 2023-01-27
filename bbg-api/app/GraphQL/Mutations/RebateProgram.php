<?php

namespace App\GraphQL\Mutations;

use App\Models\Programs;
use App\Models\Addresses;

class RebateProgram
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $argCollection = collect($args)->first();
        dd($argCollection);

        $rebatProgram = new Programs;
        $fillableFields = $rebatProgram->getFillable();


        //creating new address if key exist
        if(isset($argCollection["address"]["create"])){
            $address = new Addresses;
            $addresssFillableFileds = $address->getFillable();
            $addressArgsCollection = collect($argCollection["address"]["create"]);
            foreach ($addresssFillableFileds as $field){
                if($addressArgsCollection->has($field)){
                    $address->$field = $addressArgsCollection[$field];
                }
            }
            if($address->save()){
                $address_id = $address->id;
                $argCollection["address_id"] = $address_id;
            }
        }

        //Todo: Program's Products | Handle Multiple products might be create along with the program...
        if(isset($argCollection["products"]["create"])){
            //in array
            //Handle Multiple products might be create along with the program...
        }

        //attaching products with program
        if(isset($argCollection["products"]["connect"])){
            //Todo check the products id exists or not before attaching....
            $rebatProgram->products()->attach($argCollection["products"]["connect"]);
        }

        //attaching products with program
        if(isset($argCollection["products"]["disconnect"])){
            $rebatProgram->products()->detach($argCollection["products"]["connect"]);
        }

        $rebatProgram->save();
        return $rebatProgram;



    }
}
