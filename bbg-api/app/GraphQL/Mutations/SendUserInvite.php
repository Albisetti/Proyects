<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use App\Notifications\UserInvite;
use Illuminate\Support\Str;
use Exception;

class SendUserInvite
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::find($args['id']);
        if (!$user) {
            throw new Exception('Tried to send invite for nonexistent user!');
        }

        $user->remember_token = Str::random(25);
        $user->notify(new UserInvite($user, $user->remember_token));
        $user->save();
		
		return [
			'results' => true,
			'user' => $user
		];
    }
}
