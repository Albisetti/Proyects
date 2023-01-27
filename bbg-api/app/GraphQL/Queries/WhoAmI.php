<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use Illuminate\Support\Facades\Auth;
use App\Models\PersonalAccessToken;
use App\Models\User;
use Exception;

class WhoAmI
{
    public function __invoke($_, array $args)
    {
        return AuthHelpers::whoAmI();
    }
}
