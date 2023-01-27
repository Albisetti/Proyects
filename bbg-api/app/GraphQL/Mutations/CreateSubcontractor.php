<?php

namespace App\GraphQL\Mutations;

use App\Models\SubContractors;

class CreateSubcontractor
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $subcontractor = new SubContractors;
        $fillableFields = $subcontractor->getFillable();
        $argCollection = collect($args);

        foreach ($fillableFields as $field) {

            if($argCollection->has($field)){
                $subcontractor->$field = $args[$field];
            }
        }

        $subcontractor->save();

        return $subcontractor;
    }
}
