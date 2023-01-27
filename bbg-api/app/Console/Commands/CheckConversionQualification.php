<?php

namespace App\Console\Commands;

use App\Events\ConversionHit;
use App\Helpers\ConversionHelpers;
use App\Models\SystemMessage;
use Illuminate\Console\Command;

class CheckConversionQualification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:check-qualified-conversion';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check Conversion and Create Notification, If Needed, For Qualified Conversion';

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
        $conversions = ConversionHelpers::getConversions();

        foreach ( $conversions as $conversion ) {
            if ( !$conversion->qualified() ) continue;

            $systemMessages = SystemMessage::
            where('message_action','Conversion Hit')
                ->where('related_entity_type',get_class($conversion))
                ->where('related_entity_id',$conversion->id)
                ->exists()
            ;

            //If no Expiring Message as been recorded for this program, create some
            if(!$systemMessages){
                try {
                    event(new ConversionHit($conversion));
                    $this->info( 'Conversion ' . get_class($conversion) . ' ' . $conversion->id . ' Was Reached On ' . $conversion->qualifiedAt());
                } catch (\Exception $ex){
                    $this->error($ex->getMessage());
                }

            }
        }

        return 0;
    }
}
