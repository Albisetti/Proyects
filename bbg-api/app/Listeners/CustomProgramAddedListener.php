<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Notifications\CustomProgramAddedNotification;
use App\Notifications\ProgramCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class CustomProgramAddedListener
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
        $program = $event->program;

        DB::beginTransaction();
        try {
                $builderUsers = $event->builder->users()->whereIn('type',['builders'])->get();
                $TM = $event->builder->territoryManagers()->whereIn('type',['territory_managers'])->get();
                $users = $builderUsers->merge($TM);

                $systemMessages = SystemMessageHelpers::dispatchSystemMessage(
                    'A custom program as been assigned to your organization',
                    'Custom Program',
                    $u = $users->toArray(),
                    get_class($program),
                    $program->id
                );

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        try {
//            Notification::send($users, new CustomProgramAddedNotification($program, $event->builder));
        } catch (\Exception $ex) {
        }
    }
}
