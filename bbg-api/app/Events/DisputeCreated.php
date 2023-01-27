<?php

namespace App\Events;

use App\Models\Disputes;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DisputeCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $dispute;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Disputes $dispute)
    {
        $this->dispute = $dispute;
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
