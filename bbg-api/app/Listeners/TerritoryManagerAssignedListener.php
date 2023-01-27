<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Models\Organizations;
use App\Models\User;
use App\Notifications\TerritoryManagerAssignment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class TerritoryManagerAssignedListener
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
        $TM = User::find($event->territoryManager->id);
        $builder = Organizations::find($event->builder->id);

        DB::beginTransaction();
        try {
            //Send notification to $TM
            $systemMessages = SystemMessageHelpers::dispatchSystemMessage(
            'You have been assigned an new builder: ' . $builder->name,
            'TM Assignment',
            [$TM],
                get_class($builder),
                $builder->id
            );
            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        try {
//            Notification::send($TM, new TerritoryManagerAssignment($TM,$builder));
        } catch (\Exception $ex) {
        }
    }
}
