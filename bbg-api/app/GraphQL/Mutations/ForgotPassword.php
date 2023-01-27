<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use App\Notifications\ForgottenPasswordNotification;
use Carbon\Carbon;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Helpers\AuthHelpers;

class ForgotPassword
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
		$requesting_for_another = isset($args['requestingForAnother']) 
			&& $args['requestingForAnother'] == true;
		
        $user = User::where('email', $args['email'])->first();
        if (!$user) {
            return [
				'success' => false,
				'message' => 'No account with that e-mail address could be found.'
			];
        }

		/* Don't cooldown for organizational requests */
		if(!$requesting_for_another) {
			$thirty_minutes_ago = Carbon::now()->subMinutes(30);
			
			if ((isset($user->last_password_reset) 
				? Carbon::createFromFormat('Y-m-d H:i:s', $user->last_password_reset)->timestamp
				: 0) >= $thirty_minutes_ago->timestamp) {
				return [
					'success' => false,
					'message' => 'You are trying to reset your password too often!  Please confirm that you did not receive an email from us.'
				];
			}

			$user->last_password_reset = Carbon::now()->format("Y-m-d H:i:s");
		}

        $user->remember_token = Str::random(25);

        $user->notify(new ForgottenPasswordNotification($user, $user->remember_token, $requesting_for_another));
        $user->save();
		
		return [
			'success' => true,
			'message' => 'An email has been sent to ' . $user->email
		];
    }
}
