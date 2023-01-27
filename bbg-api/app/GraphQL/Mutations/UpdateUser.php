<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class UpdateUser
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::query()->find($args['id']);
        $userFillables = $user->getFillable();

        if (isset($args['name']))
            $user->name = $args['name'];

        if (isset($args['password']))
            $user->password = $args['password'];

        $user->save();

        if (isset($args['user_settings'])) {
            $user->load('userAttributes');

            $user->userAttribute->user_settings = $args['user_settings']; // has to be json passed
            $user->userAttribute->save();
        }

        return $user;
    }
}
