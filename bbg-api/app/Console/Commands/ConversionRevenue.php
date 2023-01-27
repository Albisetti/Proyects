<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Helpers\ConversionHelpers;
use App\Models\Houses;
use App\Models\Programs;
use App\Models\claimsRebateReports;

class ConversionRevenue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bbg:conversion-revenue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a conversion revenue report.';

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
        /*
         * Attempt to generate a tabular form of the wireframe:
         * https://balsamiq.cloud/s3236hm/pqxvu1b/r94AA 
         */
        $headers = [
            '#',
            'Conversion Name',
            'Type',
            'Measure',
            'Threshold',
            'Current',
            'Bonus Type',
            'Bonus',
            'Bonus Cap'
        ];
        $data = [];

        $numberFormatter = new \NumberFormatter('en_US', \NumberFormatter::CURRENCY);
        $conversions = ConversionHelpers::conversionRevenue();
        $conversions_with_payments = [
            "App\\Models\\ConversionFlatPayment",
            "App\\Models\\ConversionFlatPercent",
            "App\\Models\\ConversionTieredPercent",
        ];
        $total = 0;

        foreach($conversions['conversions_applied'] as &$conversion) {
            $ConversionClass = $conversion['conversion_class'];
            $model = $ConversionClass::find($conversion['conversion_id']);
            $thresholds = '';
            $top_qualifying_tier = NULL;

            if($ConversionClass === "App\\Models\\ConversionTieredPercent") {
                /* There may be multiple threshold values for a tiered-percentage conversion. */
                $tiers = $model->tiers()->get();
                
                $sorted = $tiers->sortByDesc(function($elem) use (&$thresholds, $numberFormatter) {
                    $thresholds = $thresholds === '' 
                        ? $numberFormatter->format($elem['spend_exceed'])
                        : $thresholds . "/". $numberFormatter->format($elem['spend_exceed']);
                    return $elem['spend_exceed'];
                });

                $top_qualifying_tier = $model->qualified();
            }

            $data[] = [
                $model->id,
                $model->name,
                $conversion['conversion_type'],
                isset($conversion['measure_unit']) ? $conversion['measure_unit'] : 'spend',
                $thresholds === ''
                    ? (isset($conversion['threshold']) ? $conversion['threshold']
                        : ($conversion['bonus_type'] === 'percentage_of_qualifying_payments' ? 'n/a' : ''))
                    : $thresholds,
                $conversion['conversion_class'] === "App\Models\ConversionByActivity"
                    ? $model->getActivityMeasure()
                    : (in_array($ConversionClass, $conversions_with_payments) ? $numberFormatter->format($model->paymentSum()) : ''),
                $conversion['bonus_type'],
                ($conversion['bonus_type'] === 'flat_amount'
                || $conversion['bonus_type'] === 'percentage_of_qualifying_payments'
                    ? $numberFormatter->format($conversion['bonus_amount'])
                    : $top_qualifying_tier->bonus_amount . "% ({$numberFormatter->format($conversion['bonus_amount'])})"),
                isset($conversion['max_bonus']) ? $numberFormatter->format($conversion['max_bonus']) : 'n/a'
            ];

            $total += $conversion['bonus_amount'];
        }

        $total_headers = ['Total Conversion Revenue'];
        $total_data = [[
            "{$numberFormatter->format($total)}"
        ]];

        $this->table($headers, $data);

		$quarterly_headers = ['Quarter', 'Start', 'End', 'Total'];
		$formatted_quarters = array_map(function($elem) use ($numberFormatter) {
			return [
				$elem['displayName'],
				$elem['start']->format('Y-m-d'),
				$elem['end']->format('Y-m-d'),
				$numberFormatter->format($elem['total'])
			];
		}, $conversions['quarterly']);

		$this->table($quarterly_headers, $formatted_quarters);
        $this->table($total_headers, $total_data);

        return 0;
    }
}
