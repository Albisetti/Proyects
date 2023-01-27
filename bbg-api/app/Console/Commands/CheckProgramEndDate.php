<?php

namespace App\Console\Commands;

use App\Events\ProgramEndDate;
use App\Models\SystemMessage;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckProgramEndDate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:check-program-end-date';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check Programs And Create Notifications, If Needed, if programs end_date as passed';

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
        $programs = \App\Models\Programs::get();
        foreach ($programs as $program){
            if(!isset($program->end_date)) continue;
            $programEndDate = Carbon::createFromFormat('Y-m-d',$program->end_date);

            if ( $now->isAfter($programEndDate) )
            {
                $systemMessages = SystemMessage::
                where('message_action','Program Has Ended')
                    ->where('related_entity_type',get_class($program))
                    ->where('related_entity_id',$program->id)
                    ->exists()
                ;

                //If no Expiring Message as been recorded for this program, create some
                if(!$systemMessages){
                    try {
                        event(new ProgramEndDate($program));
                        $this->info('A System Message For Program ' . $program->id . ' has been created');
                    } catch (\Exception $ex){
                        $this->error($ex->getMessage());
                    }

                }
            }
        }
        $this->info('Programs end_date Have Been Verified');
        return 0;
    }
}
