<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Notifications\ProgramCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

class ProgramCreatedListener
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
        //If not possible participants and/or user to notify, skip to re-try later
        $program = $event->program;
        $possibleParticipants = $program->possibleRegionParticipants();
        $possibleTMs =  $program->possibleRegionTerritoryManagers();

        $users = $possibleTMs;

        DB::beginTransaction();
        try {
            foreach( $possibleParticipants as $builder ){
                $builderUsers = $builder->users()->whereIn('type',['builders'])->get();
                $users = $users->merge($builderUsers);
                $TM = $builder->territoryManagers()->whereIn('type',['territory_managers'])->get();
                $users = $users->merge($TM);
            }

                $systemMessages = SystemMessageHelpers::dispatchSystemMessage(
                    'A new program is available for your region',
                    'New Program added',
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
//            Notification::send($users, new ProgramCreatedNotification($program));
        } catch (\Exception $ex) {
        }
    }
}
