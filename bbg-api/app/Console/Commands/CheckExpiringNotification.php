<?php

namespace App\Console\Commands;

use App\Models\SystemMessage;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckExpiringNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:check-expiring-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check SystemMessages And set read_at, If Needed';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $now = Carbon::now();
        $twoWeeksAgo = clone $now;
        $twoWeeksAgo->subWeeks(2);
        $systemMessages = SystemMessage::get();

        foreach ($systemMessages as $systemMessage){
            if(!isset($systemMessage->read_at)){
                if($systemMessage->created_at->isBefore($twoWeeksAgo)){ //if created 2 weeks or further ago
                    $systemMessage->read_at = $now;
                    $systemMessage->save();
                    $this->info('SystemMessage ' . $systemMessage->id .' marked read');
                }
            }
        }

        $this->info('SystemMessages Has been checked');
        return 0;
    }
}
