<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Models\User;
use App\Notifications\ClaimPeriodCloseNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ClaimPeriodCloseListener
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
        DB::beginTransaction();
        try {

            $users = User::whereIn('type',['admin','territory_managers'])->get();

                $systemMessages = SystemMessageHelpers::dispatchSystemMessage(
                    'The ' . $event->year . ' Q' . $event->quarter . ' has been closed.',
                    'Period is confirmed as closed',
                    $u = $users->toArray()
                );

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        try {
//            Notification::send($users, new ClaimPeriodCloseNotification($event->quarter,$event->year));
        } catch (\Exception $ex) {
        }
    }
}
