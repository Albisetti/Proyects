<?php

namespace App\Events;

use App\Models\Organizations;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TerritoryManagerAssigned
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $builder;
    public $territoryManager;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Organizations $builder, User $territoryManager)
    {
        //
        $this->builder = $builder;
        $this->territoryManager = $territoryManager;
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
