<?php

namespace App\GraphQL\Mutations;

use App\Models\Organizations;
use App\Models\Addresses;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

class CreateOrganization
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $argCollection = collect($args)->first();

//        $validator = Validator::make($argCollection, [
//            'organization_type'   => 'required|max:50',
//            'body'          => 'profanity|required',
//            'ids'         => 'required|array',
//            'ids.*'       => 'required',
//            'payload'        => 'sometimes',
//        ]);
//
//        if ($validator->fails()) {
//            throw new \Exception($validator->errors());
//        }

        $organization = new Organizations;
        $fillableFields = $organization->getFillable();

        $address_id = null;
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

        foreach ($fillableFields as $field) {
            //if (in_array(trim($field), $args)) { => in_array do not work with associative array
            $inputFields = collect($argCollection);
            if($inputFields->has($field)){
                //var_dump($argCollection[$field]);
                $organization->$field = $argCollection[$field];
            }
        }
        $organization->save();
        return $organization;
    }
}
