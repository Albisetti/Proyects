<?php

namespace App\Listeners;

use App\Helpers\SystemMessageHelpers;
use App\Models\Disputes;
use App\Notifications\CustomProgramAddedNotification;
use App\Notifications\DisputeCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Queue\InteractsWithQueue;

class DisputeCreatedListener
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
        $dispute = $event->dispute;
        $rebate = $dispute->rebateReport()->with(['houses','products','rebateReports.organization','rebateReports.organization.users'])->first();
        $builder = $rebate->rebateReports->organization;
        $builderUsers = $rebate->rebateReports->organization->users->whereIn('type',['builders']);
        $territoryManager = $builder->territoryManagers()->whereIn('type',['territory_managers'])->get();
        $users = $territoryManager->merge($builderUsers);

        DB::beginTransaction();
        try {
            $systemMessage = SystemMessageHelpers::dispatchSystemMessage(
                ('A new dispute as been created for ' . $rebate->products->name . ' on the following address: ' . $rebate->houses->address),
                ('Dispute initiated'),
                $users->toArray(),
                get_class($dispute),
                $dispute->id
            );
            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        try {
//            Notification::send($users, new DisputeCreatedNotification($dispute,$rebate->houses,$rebate->products));
        } catch (\Exception $ex) {
        }
    }
}
