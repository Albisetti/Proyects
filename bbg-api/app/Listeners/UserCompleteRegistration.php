<?php

namespace App\Listeners;

use App\Notifications\UserCompletedRegistration;
use Illuminate\Contracts\Queue\ShouldQueue;
use \Illuminate\Support\Facades\Notification;
use Illuminate\Queue\InteractsWithQueue;

class UserCompleteRegistration
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
        try {
            Notification::send($event->user, new UserCompletedRegistration($event->user));
        } catch (\Exception $ex) {
        }
    }
}
