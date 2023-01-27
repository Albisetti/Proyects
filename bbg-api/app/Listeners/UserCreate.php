<?php

namespace App\Listeners;

use App\Notifications\UserInvite;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class UserCreate
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
            Notification::send($event->user, new UserInvite($event->user));
        } catch (\Exception $ex) {
        }
    }
}
