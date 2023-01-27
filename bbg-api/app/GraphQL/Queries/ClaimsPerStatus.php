<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;

class ClaimsPerStatus
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $claims = (new Claims())->newQuery();
        if(isset($args['claim_type'])){
            $claims->where('claim_type', $args['claim_type']);
        }
        if( isset($args['status']) ){
            $claims->where(function ($query)use($args){
                foreach ( $args['status'] as $status ){
                    $query->orWhere('status', $status);
                }
            });
        }

        return $claims;
    }
}
