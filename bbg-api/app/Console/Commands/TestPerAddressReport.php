<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Houses;
use App\Models\Organizations;
use App\Models\Products;
use App\Models\Programs;
use App\Models\RebateReportsHousesProducts;
use App\Models\claimsRebateReports;

use App\Helpers\ConversionHelpers;
use App\Helpers\RebateReporting;

class TestPerAddressReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:report-address';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a per-address rebate report for a given address by house_id.';

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
        /* This is an ad hoc test command, disregard */
        $claimRebateReport = claimsRebateReports::find(165);
        $claimRebateReport->touch();
        $claimRebateReport->save();

        $conversions = ConversionHelpers::conversionRevenue();
        $rebate = RebateReportsHousesProducts::find(267);

        $report = $rebate->generateReport($conversions);

        $this->info(json_encode($report, JSON_PRETTY_PRINT));

		return 0;
	}
}
