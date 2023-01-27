<?php

namespace App\GraphQL\Mutations;

use App\Models\SubContractors;

class UpdateSubcontractor
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $subcontractor = SubContractors::findOrFail($args['id']);
        $fillableFields = $subcontractor->getFillable();
        $argCollection = collect($args['input']);

        foreach ($fillableFields as $field) {
            if($argCollection->has($field)){
                $subcontractor->$field = $args[$field];
            }
        }

        $subcontractor->save();

        return $subcontractor;
    }
}
