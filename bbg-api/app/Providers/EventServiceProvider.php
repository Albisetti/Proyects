<?php

namespace App\Providers;

use App\Events\BatchUpsertDispute;
use App\Events\BuilderFirstBundle;
use App\Events\ClaimPeriodClose;
use App\Events\ClaimUpdate;
use App\Events\ConversionHit;
use App\Events\CustomProgramAdded;
use App\Events\DisputeCreated;
use App\Events\ProgramCreated;
use App\Events\ProgramEndDate;
use App\Events\ProgramExpiring;
use App\Events\ProgramStartDate;
use App\Events\SubdivisionCreated;
use App\Events\TerritoryManagerAssigned;
use App\Events\VolumeClaimsBuildersSaved;
use App\Listeners\BatchUpsertDisputeListener;
use App\Listeners\BuilderFirstBundleListener;
use App\Listeners\ClaimPeriodCloseListener;
use App\Listeners\ClaimUpdateListener;
use App\Listeners\ConversionHitListener;
use App\Listeners\CustomProgramAddedListener;
use App\Listeners\ProgramCreatedListener;
use App\Listeners\ProgramEndDateListener;
use App\Listeners\ProgramExpiringListener;
use App\Listeners\ProgramStartDateListener;
use App\Listeners\SubdivisionCreatedListener;
use App\Models\claimsRebateReports;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

use App\Events\ClaimRebateReportSaved as ClaimRebateReportSavedEvent;
use App\Listeners\ClaimRebateReportSaved as ClaimRebateReportSavedListener;
class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class
		],
		ClaimRebateReportSavedEvent::class => [
			ClaimRebateReportSavedListener::class
		],
        VolumeClaimsBuildersSaved::class => [
            \App\Listeners\VolumeClaimsBuildersSaved::class
        ],
        TerritoryManagerAssigned::class => [
            \App\Listeners\TerritoryManagerAssignedListener::class
        ],
        DisputeCreated::class => [
            \App\Listeners\DisputeCreatedListener::class
        ],
        ProgramCreated::class => [
            ProgramCreatedListener::class
        ],
        ClaimPeriodClose::class => [
            ClaimPeriodCloseListener::class
        ],
        CustomProgramAdded::class => [
            CustomProgramAddedListener::class
        ],
        BuilderFirstBundle::class => [
            BuilderFirstBundleListener::class
        ],
        ConversionHit::class => [
            ConversionHitListener::class
        ],
        SubdivisionCreated::class => [
            SubdivisionCreatedListener::class
        ],
        ProgramExpiring::class => [
            ProgramExpiringListener::class
        ],
        ProgramStartDate::class => [
            ProgramStartDateListener::class
        ],
        ProgramEndDate::class => [
            ProgramEndDateListener::class
        ],
        BatchUpsertDispute::class => [
            BatchUpsertDisputeListener::class
        ],
        ClaimUpdate::class => [
            ClaimUpdateListener::class
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
