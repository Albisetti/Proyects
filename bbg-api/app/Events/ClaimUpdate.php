<?php

namespace App\Events;

use App\Models\Claims;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ClaimUpdate
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $claim;
    public $closing;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Claims $claim, $closing, $builderId=null)
    {
        //
        $this->claim = $claim;
        $this->closing = $closing;
        $this->builderId = $builderId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
//    public function broadcastOn()
//    {
//        return new PrivateChannel('channel-name');
//    }
}
