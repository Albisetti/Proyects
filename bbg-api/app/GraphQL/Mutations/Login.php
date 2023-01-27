<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Types\Success;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

use App\Models\User;
use Error;

class Login
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $guard = Auth::guard('web');

        if(!$guard->attempt($args)) {
			$response = [
				'user' => NULL,
				'error' => true,
				'message' => 'Unable to successfully authenticate.',
				'token' => NULL
			];

			return $response;
        }

        $user = $guard->user();
		$response = [
			'user' => $user,
			'error' => false,
			'message' => '',
			'token' => $user->createToken('bbg-login-session')->plainTextToken
		];

//		Auth::login($user);
        return $response;
    }
}

