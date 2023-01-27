<?php

namespace App\Listeners;

use App\Helpers\ClaimReporting;
use App\Models\claimsRebateReports;
use App\Models\RebateReportsHousesProducts;
use App\Notifications\UserCompletedRegistration;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Queue\InteractsWithQueue;
use App\Helpers\ConversionHelpers;

class ClaimRebateReportSaved
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {

        try {
            ClaimReporting::calculateAndSetClaimTotal($event->claimRebateReport);//Out-dated due to too much change to be done on a save, please use the graphql calculateClaimAllocation mutation to newly created
        } catch (\Exception $ex){
            throw $ex;
        }

    }
}
