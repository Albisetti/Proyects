<?php

namespace App\Console\Commands;

use App\Helpers\SystemMessageHelpers;
use App\Models\Disputes;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckBatchUpsertDispute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:check-dispute-batchUpsert';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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

        $event = new \stdClass();
        $event->newDisputes = Disputes::latest()->limit(4)->get();

        if ( isset($event->newDisputes) && !empty($event->newDisputes) ){
            foreach ($event->newDisputes as $dispute) {
                $rebate = $dispute->rebateReport()->with(['houses','products','rebateReports.organization','rebateReports.organization.users'])->first();
                $builder = $rebate->rebateReports->organization;
                $builderUsers = $rebate->rebateReports->organization->users->whereIn('type',['builders']);
                $territoryManager = $builder->territoryManagers()->whereIn('type',['territory_managers'])->get();
                $users = $territoryManager->merge($builderUsers);

                DB::beginTransaction();
                try {
                    $systemMessage = SystemMessageHelpers::dispatchSystemMessage(
                        ('A new dispute as been created for ' . $rebate->products->name . ' on the following address: ' . $rebate->houses->address),
                        ('Dispute initiated'),
                        $users->toArray(),
                        get_class($dispute),
                        $dispute->id
                    );
                    DB::commit();
                } catch (\Exception $ex) {
                    DB::rollBack();
                    throw $ex;
                }

                try {
//                  Notification::send($users, new DisputeCreatedNotification($dispute,$rebate->houses,$rebate->products));
                } catch (\Exception $ex) {
                }
            }
        }

        return 0;
    }
}
