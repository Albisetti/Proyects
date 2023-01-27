<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class IsEmailAddressAvailable
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::where('email', $args['email'])->first();
        if(!$user) {
            return null;
        }

        return [
            "exists" => true,
            "existing_account_type" => $user->type
        ];
    }
}
