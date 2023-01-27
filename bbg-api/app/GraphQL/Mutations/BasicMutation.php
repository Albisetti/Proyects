<?php

namespace App\GraphQL\Mutations;

use Illuminate\Database\Eloquent\Relations\Relation;

class BasicMutation
{

    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args, $modelname)
    {

        $model = $modelname::find($args['id']);

        if ( !$model ) throw new \Exception('No ' . $modelname . ' found with provided id');

        $fillableFields = $model->getFillable();
        $argCollection = collect($args);

        foreach ($fillableFields as $field) {
            //if (in_array(trim($field), $args)) { => in_array do not work with associative array
            if($argCollection->has($field)){
                $model->$field = $args[$field];
            }
        }

        //TODO: relationships

        $model->save();

        return $model;
    }
}
