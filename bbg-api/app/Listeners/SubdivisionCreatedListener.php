<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Notifications\SubdivisionCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class SubdivisionCreatedListener
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
        $subdivision = $event->subdivision;
        $builder = $subdivision->organization()->first();

        DB::beginTransaction();
        try {
                $builderUsers = $builder->users()->whereIn('type',['builders'])->get();
                $TM = $builder->territoryManagers()->whereIn('type',['territory_managers'])->get();
                $users = $builderUsers->merge($TM);

                $systemMessages = SystemMessageHelpers::dispatchSystemMessage(
                    'A new subdivision is now available for your organization',
                    'New Subdivision added',
                    $u = $users->toArray(),
                    get_class($subdivision),
                    $subdivision->id
                );

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        try {
//            Notification::send($users, new SubdivisionCreatedNotification($subdivision,$builder));
        } catch (\Exception $ex) {
        }
    }
}
