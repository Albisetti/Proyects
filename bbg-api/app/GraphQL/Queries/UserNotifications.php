<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\SystemMessage;

class UserNotifications
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            $user = AuthHelpers::whoAmI();
        } catch (\Exception $ex){
            throw $ex;
        }

        $systemNotification = SystemMessage::where('user_id',$user['user']->id);

        if(!isset($args['includeRead']) || $args['includeRead']==false) $systemNotification->whereNull('read_at');

        return $systemNotification;
    }
}
