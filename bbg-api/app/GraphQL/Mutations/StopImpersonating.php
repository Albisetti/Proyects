<?php

namespace App\GraphQL\Mutations;

use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use Exception;

class StopImpersonating
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $guard = Auth::guard(config('sanctum.web'));
        $user = $guard->user();

        /* If there is no user, we cannot proceed. */
        if (!$user) {
            throw new Exception('Unauthenticated user attempting request on resolver requiring authorization.');
        }

        /* If no token or token was not impersonating, abort. */
        $current_access_token = $user->currentAccessToken();
        if(!$current_access_token || !isset($current_access_token->parent_token_id)) {
            throw new Exception('Trying to stop impersonating with a bad token or a token which was not impersonating.');
        }

        $parent_token = PersonalAccessToken::find($current_access_token->parent_token_id);
        if(!$parent_token) {
            throw new Exception('Trying to exit impersonation when parent token has been revoked.');
        }

        $target = User::find($parent_token->tokenable_id);
        if(!$target) {
            throw new Exception('Trying to exit impersonation into parent token whose user no longer exists.');
        }

        $token = $target->createToken('bbg-login-session');

        /* Destroy the impersonator token - we have to be sure! */
        $current_access_token->delete();

        return [
            'user' => $target,
            'token' => $token->plainTextToken
        ];
    }
}
