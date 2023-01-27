<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use App\Models\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;
use Exception;

class Impersonate
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($context, array $args)
    {
        $guard = Auth::guard(config('sanctum.web'));

        $user = $guard->user();
		$target = User::find($args['id']);

		if(!$user || !$target) {
			throw new Exception('Impersonate request for an invalid user or target.');
		}

		/* Retrieve the id of the PAT model used to authenticate this request */
		$current_access_token = $user->currentAccessToken();
		if(!$current_access_token) {
			throw new Exception('Trying to impersonate as an invalid user.');
		}
		
		$current_access_token_id = $current_access_token->id;

		/* Create a new token for the target user */
		$token_name = 'impersonation-' . $user->id . '-' . $target->id;
    	$token = $target->createToken($token_name);

		/* Set its parent token to indicate an impersonation, and to tie back to this user */
		$token->accessToken->parent_token_id = $current_access_token_id;
		$token->accessToken->save();

		/* Update new PAT with parent id of impersonator, then return */
		$resp = [
			'user' => $target,
			'token' => $token->plainTextToken,
			'impersonator' => $user
		];

        return $resp;
    }
}
