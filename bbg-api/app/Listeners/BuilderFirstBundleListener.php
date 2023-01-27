<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Notifications\BuilderFirstBundleNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class BuilderFirstBundleListener
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
        $bundle = $event->bundle;
        $builder = $event->builder;

        DB::beginTransaction();
        try {
            $builderUsers = $builder->users()->whereIn('type',['builders'])->get();
            $TM = $builder->territoryManagers()->whereIn('type',['territory_managers'])->get();
            $users = $builderUsers->merge($TM);

            $systemMessages = SystemMessageHelpers::dispatchSystemMessage(
                $builder->name . ' now has a bundle available',
                'builder first bundle ',
                $u = $users->toArray(),
                get_class($bundle),
                $bundle->id
            );

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        try {
//            Notification::send($users, new BuilderFirstBundleNotification($bundle,$builder));
        } catch (\Exception $ex) {
        }
    }
}
