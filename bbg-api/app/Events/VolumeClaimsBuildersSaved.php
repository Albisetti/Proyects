<?php

namespace App\Events;

use App\Models\VolumeClaimsBuilders;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VolumeClaimsBuildersSaved
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $volumeClaimBuilder;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(VolumeClaimsBuilders $volumeClaimBuilder)
    {
        //
        $this->volumeClaimBuilder = $volumeClaimBuilder;
    }
}
