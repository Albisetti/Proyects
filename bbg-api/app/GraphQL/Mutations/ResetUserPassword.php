<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class ResetUserPassword
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $user = User::find($args['id']);
        if ( !$user ) throw new \Exception('No Rebate Report found with provided id');

        return [
            "results" => false, //TODO: pass results
            "user" => $user
        ];
    }
}
