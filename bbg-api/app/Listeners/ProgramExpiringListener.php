<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProgramExpiringListener
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
            $users = User::where('type','admin')->get();

            $systemMessages = SystemMessageHelpers::dispatchSystemMessage(
                'A program is about to expire',
                'Program About To Expire',
                $users->toArray(),
                get_class($program),
                $program->id
            );

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            Log::info($ex->getMessage());
            throw $ex;
        }
    }
}
