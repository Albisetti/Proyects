<?php

namespace App\Helpers;

use Carbon\Carbon;

use App\Models\ConversionByActivity;
use App\Models\ConversionFlatPayment;
use App\Models\ConversionFlatPercent;
use App\Models\ConversionTieredPercent;
use Carbon\CarbonPeriod;

const VALID_CONVERSION_PAYMENT_PERIODS = ['year', 'quarter', 'month', 'all'];

class ConversionHelpers
{
    /**
     * There are four different models providing conversion types; this
     * function gathers all *qualified* conversions from each in a common
     * array.
     *
     * @return array $conversions - An array of qualified conversions.
     */
    public static function getConversions($program = NULL, $qualified = true)
    {
		/* If we aren't filtering on a program, get ALL conversions. */
        if(!$program) {
            $activity_conversions = ConversionByActivity::with(['payment','program'])->get();
            $tiered_conversions = ConversionTieredPercent::with(['tiers','payment','program'])->get();
            $flat_payment_conversions = ConversionFlatPayment::with(['payment','program'])->get();
            $flat_percent_conversions = ConversionFlatPercent::with(['payment','program'])->get();
        } else {
			/* Only the set of conversions on this program. */
            $activity_conversions = $program->conversionByActivity()->with(['payment','program'])->get();
            $tiered_conversions = $program->conversionTieredPercent()->with(['tiers','payment','program'])->get();
            $flat_payment_conversions = $program->conversionFlatPayment()->with(['payment','program'])->get();
            $flat_percent_conversions = $program->conversionFlatPercent()->with(['payment','program'])->get();
        }

        $qualifying_conversions = [];

        foreach ($activity_conversions as $activity_conversion) {
            if ($qualified && $activity_conversion->qualified()) {
                $qualifying_conversions[] = $activity_conversion;
            } else if ($qualified === false) {
                $qualifying_conversions[] = $activity_conversion;
			}
        }

        foreach ($tiered_conversions as $tier_conversion) {
            $qualified_tier = $tier_conversion->qualified();

            if ($qualified && $qualified_tier) {
                $qualifying_conversions[] = $tier_conversion;
            } else if (!$qualified && !$qualified_tier) {
                $qualifying_conversions[] = $tier_conversion;
			}
        }

        foreach ($flat_payment_conversions as $flat_payment_conversion) {
            if ($qualified && $flat_payment_conversion->qualified()) {
                $qualifying_conversions[] = $flat_payment_conversion;
            } else if (!$qualified && !$flat_payment_conversion->qualified()) {
                $qualifying_conversions[] = $flat_payment_conversion;
			}
        }

        foreach ($flat_percent_conversions as $flat_percent_conversion) {
            if ($qualified && $flat_percent_conversion->qualified()) {
                $qualifying_conversions[] = $flat_percent_conversion;
            } else if (!$qualified && !$flat_percent_conversion->qualified()) {
				$qualifying_conversions[] = $flat_percent_conversion;
			}
        }

        return $qualifying_conversions;
    }

    public static function conversionRevenue($program = NULL, $year = NULL)
    {
        $now = $year ? Carbon::now()->setYear($year)->lastOfYear() : Carbon::now();
        $q = Carbon::now()->subQuarters($now->quarter - 1)->firstOfQuarter();
        $quarterly = [
            0 => [],
            1 => [],
            2 => [],
            3 => []
        ];

        /* The body of this for-loop will index each quarter of the current year. */
        for($q = Carbon::now()->subQuarters($now->quarter - 1)->firstOfQuarter(), $i = 0;
            $i < 4; $i++,
            $q = $q->addQuarter(1)) {
            $quarterly[$i]['quarter'] = $i+1;
            $quarterly[$i]['displayName'] = 'Q' . ($i+1) . " {$now->year}";
            $quarterly[$i]['start'] = clone $q;
            $quarterly[$i]['end'] = (clone $q)->lastOfQuarter();
            $quarterly[$i]['total'] = 0;
        }

        $qualifying_conversions = self::getConversions($program, true);
        $total = 0;
        $log = [];

        foreach ($qualifying_conversions as $conversion) {
            /* Differentiate by class, as this is a polymorphic type. */
            $conversion_type = get_class($conversion);

            if(method_exists($conversion, 'qualifiedAt')) {
                if($conversion->qualifiedAt() > $now) {
                    continue;
                }
            }

            switch ($conversion_type) {
                /* Unsupported conversion tried? */
                default:
                    throw new \Exception("Trying to handle unsupported conversion type: {$conversion_type}");
                    break;

                /*
                 * Flat payment conversion: if the payment amount is exceeded, then a flat bonus is applied.
                 */
                case "App\\Models\\ConversionFlatPayment":
                    $log[] = [
                        'conversion_id' => $conversion->id,
                        'conversion_class' => $conversion_type,
                        'conversion_type' => 'flat_payment',
                        'summary' => "Conversion {$conversion->name} attached to program {$conversion->program->name} has sum \${$conversion->paymentSum()}, exceeding \${$conversion->amount} to qualify for a flat bonus.",
                        'bonus_type' => 'flat_amount',
                        'threshold' => $conversion->amount,
                        'payment_sum' => $conversion->paymentSum(),
                        'bonus_amount' => $conversion->bonus_amount
                    ];

                    $qualified_at = $conversion->qualifiedAt();
                    $quarterly[$qualified_at->quarter - 1]['total'] += $conversion->amount;

                    $total += $conversion->bonus_amount;
                    break;

                /*
                 * Flat percent-based conversion.
                 */
                case "App\\Models\\ConversionFlatPercent":
                    $payment_period = $conversion->getValidPaymentPeriod();

                    $bonus_amount = MIN(
                        $conversion->max_amount,
                        $conversion->paymentSum($payment_period) * ($conversion->bonus_percent / 100)
                    );

                    $log[] = [
                        'conversion_id' => $conversion->id,
                        'conversion_class' => $conversion_type,
                        'conversion_type' => 'flat_percentage',
                        'summary' => "Conversion {$conversion->name} attached to program {$conversion->program->name} has payments summing \${$conversion->paymentSum()} in its valid payment period, qualifying for a {$conversion->bonus_percent}% bonus with a \${$conversion->max_amount} cap.",
                        'bonus_type' => 'percentage_of_qualifying_payments',
                        'max_bonus' => $conversion->max_amount,
                        'bonus_amount' => $bonus_amount,
                        'valid_payment_period' => [
                            'start' => $payment_period->getStartDate(),
                            'end' => $payment_period->getEndDate()
                        ],
                        'payment_sum' => $conversion->paymentSum($payment_period)
                    ];

                    $payments = $conversion->payment
                        ->sortBy('payment_date')
                        ->whereBetween('payment_date', [$quarterly[0]["start"], $quarterly[3]["end"]])
                    ;

                    $c = 0;

                    foreach($payments as $payment) {
                        $payment_date = new Carbon($payment->payment_date);

                        $payment_bonus = $payment->amount * ($conversion->bonus_percent / 100);
                        $c += $payment_bonus;

                        $quarterly[$payment_date->quarter - 1]['total'] += $bonus_amount;
                    }

                    $total += $bonus_amount;
                    break;

                /*
                 * Bonus percentages based on tiered threshold 'spend exceed' values
                 * for conversion payments, with an upper bound on the $ amount earned.
                 */
                case "App\\Models\\ConversionTieredPercent":
                    /*
                     * Because this qualified, we know we'll have a non-NULL tier value here.
                     */
                    $tier = $conversion->qualified();

                    /*
                     * Choose the minimum value of either the conversion's maximum amount, or else
                     * the payment sum multiplied by the qualified conversion tier bonus percentage.
                     */
                    $bonus_amount = MIN(
                        $conversion->max_amount,
                        $conversion->paymentSum() * ($tier->bonus_amount / 100)
                    );

                    $log[] = [
                        'conversion_id' => $conversion->id,
                        'conversion_type' => 'tiered_percentages',
                        'conversion_class' => $conversion_type,
                        'summary' => "Conversion {$conversion->name} attached to program {$conversion->program->name} has paid \${$conversion->paymentSum()}, exceeding spend_exceed to qualify for {$tier->note}.",
                        'max_bonus' => $conversion->max_amount,
                        'bonus_type' => 'percentage_of_payment',
                        'payment_sum' => $conversion->paymentSum($conversion->getValidPaymentPeriod()),
                        'valid_payment_period' => [
                            'start' => $conversion->getValidPaymentPeriod()->getStartDate(),
                            'end' => $conversion->getValidPaymentPeriod()->getEndDate()
                        ],
                        'bonus_amount' => $bonus_amount
                    ];

                    $payments = $conversion->payment
                        ->sortBy('payment_date')
                        ->whereBetween('payment_date', [$quarterly[0]["start"], $quarterly[3]["end"]])
                    ;

                    $c = 0;

                    foreach($payments as $payment) {
                        $payment_date = new Carbon($payment->payment_date);

                        $payment_bonus = $payment->amount * ($tier->bonus_amount / 100);
                        $c += $payment_bonus;

                        $quarterly[$payment_date->quarter - 1]['total'] += $bonus_amount;
                    }

                    $total += $bonus_amount;
                    break;

                /*
                 * Conversions with variable bonus types (flat amt, per unit rebate amount increase)
                 */
                case "App\\Models\\ConversionByActivity":
                    switch ($conversion->bonus_type) {
                        /*
                         * Simplest case: a flat amount was added by trigger: this
                         * will be allocated entirely, unmodified, to BBG.
                         */
                        case 'flat amount':
                            $log[] = [
                                'conversion_id' => $conversion->id,
                                'conversion_type' => 'activity',
                                'conversion_class' => $conversion_type,
                                'summary' => "Conversion {$conversion->name} attached to program {$conversion->program->name} qualified and triggered a \${$conversion->bonus_amount} flat bonus.",
                                'bonus_type' => 'flat_amount',
                                'measure_unit' => $conversion->measure_unit,
                                'bonus_amount' => $conversion->bonus_amount,
                                'threshold' => $conversion->getActivityMeasure(true)
                            ];

                            $total += $conversion->bonus_amount;

                            $qualified_at = $conversion->qualifiedAt();
                            if($qualified_at) {
                                $quarterly[$qualified_at->quarter - 1]['total'] += $conversion->bonus_amount;
                            }
                            break;

                        case 'rebate amount increase per unit':
                            $log[] = [
                                'conversion_id' => $conversion->id,
                                'conversion_type' => 'activity',
                                'conversion_class' => $conversion_type,
                                'summary' => "Conversion {$conversion->name} attached to program {$conversion->program->name} qualified and triggered a \${$conversion->bonus_amount} rebate amount per unit bonus.",
                                'bonus_type' => 'rebate_per_unit',
                                'measure_unit' => $conversion->measure_unit,
                                'bonus_amount' => $conversion->bonus_amount,
                                'threshold' => $conversion->getActivityMeasure(true)
                            ];

                            break;
                    }
            }
        }

        return [
            'conversions_applied' => $log,
            'quarterly' => $quarterly,
            'yearTotal' => [
                'year' => $now->year,
                'total' => (
                    $quarterly[0]['total']
                    + $quarterly[1]['total']
                    + $quarterly[2]['total']
                    + $quarterly[3]['total']
                )
            ],
            'program' => $program,
            'total' => $total
        ];
    }
}
