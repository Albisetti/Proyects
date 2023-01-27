<?php

namespace App\GraphQL\Mutations;

use App\Helpers\AuthHelpers;
use App\Models\Organizations;
use App\Models\SystemMessage;
use Carbon\Carbon;

class NotificationRead
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            $whoAmI = AuthHelpers::whoAmI();
            $user = AuthHelpers::extractUserFromWhoAmI($whoAmI);

            $systemMessage = SystemMessage::where('id',$args['id'])->first();

            if( !isset($systemMessage->read_at ) ){
                $systemMessage->read_at = Carbon::now();
                $systemMessage->read_by = $user->id;
                $systemMessage->save();
            }

        } catch ( \Exception $ex ) {
            throw $ex;
        }

        $systemMessage->refresh();
        return $systemMessage;
    }
}
