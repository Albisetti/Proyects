<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Models\User;
use App\Notifications\ConversionHitNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ConversionHitListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        //
        $conversion = $event->conversion;
        $admins = User::where('type','admin')->get();

        DB::beginTransaction();
        try {

            $systemMessages = SystemMessageHelpers::dispatchSystemMessage(
                'A Conversion was reached on ' . $conversion->qualifiedAt(),
                'Conversion Hit',
                $u = $admins->toArray(),
                get_class($conversion),
                $conversion->id
            );

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        try {
//            Notification::send($admins, new ConversionHitNotification($conversion));
        } catch (\Exception $ex) {
        }
    }
}
