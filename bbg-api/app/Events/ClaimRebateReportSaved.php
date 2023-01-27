<?php

namespace App\Events;

use App\Models\claimsRebateReports;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ClaimRebateReportSaved {
    use Dispatchable, SerializesModels;

    public $claimRebateReport;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(claimsRebateReports $claimRebateReport)
    {
        $this->claimRebateReport = $claimRebateReport;
    }
}