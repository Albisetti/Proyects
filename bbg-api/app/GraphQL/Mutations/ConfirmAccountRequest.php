<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Exception;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class ConfirmAccountRequest
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
		if(!strlen($args['forgotCode'])) {
			throw new Exception('Bad forgot code data received.');
		}

		$target = User::whereNotNull('remember_token')
			->where('remember_token', '=', $args['forgotCode'])
			->first();
		if(!$target || $target->email_verified_at != null) {
			return [
				"token" => null,
				"user" => null
			];
		}

        $target->email_verified_at = Carbon::now();
		$target->password = Hash::make($args['newPassword']);
		$target->remember_token = NULL;
		$target->save();

		$token = $target->createToken('bbg-login-session')->plainTextToken;
		if(!$token) {
			return [
				"token" => null,
				"user" => null
			];
		}

		return [
			"token" => $token,
			"user" => $target
		];
    }
}
